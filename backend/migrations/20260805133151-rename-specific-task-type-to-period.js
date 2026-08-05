// Renames TaskTemplate.type "SPECIFIC" -> "PERIOD" and collapses each
// SPECIFIC template's per-day Task instances into the single shared Task
// instance the PERIOD model expects. A template that was ever completed on
// any day keeps status DONE for the merged instance.
const STATUS_RANK = { DONE: 2, IN_PROGRESS: 1, TODO: 0 };

const mergeStatus = (tasks) =>
  tasks.reduce(
    (best, task) => (STATUS_RANK[task.status] > STATUS_RANK[best] ? task.status : best),
    'TODO',
  );

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async up(db) {
    const templates = db.collection('TaskTemplate');
    const tasks = db.collection('Task');

    const specificTemplates = await templates.find({ type: 'SPECIFIC' }).toArray();

    for (const template of specificTemplates) {
      const templateTasks = await tasks
        .find({ templateId: template._id })
        .sort({ date: 1 })
        .toArray();

      const startDate =
        template.startDate ??
        templateTasks[0]?.date ??
        template.createdAt.toISOString().slice(0, 10);
      const endDate = template.endDate ?? startDate;

      await templates.updateOne(
        { _id: template._id },
        { $set: { type: 'PERIOD', startDate, endDate } },
      );

      if (templateTasks.length === 0) {
        continue;
      }

      const [keep, ...rest] = templateTasks;
      const status = mergeStatus(templateTasks);

      await tasks.updateOne(
        { _id: keep._id },
        { $set: { date: startDate, status } },
      );

      if (rest.length > 0) {
        await tasks.deleteMany({ _id: { $in: rest.map((task) => task._id) } });
      }
    }
  },

  /**
   * Reverts the type rename. Does NOT re-split merged Task instances back
   * into per-day rows — that information (which days existed, individual
   * per-day statuses) was discarded by `up` and can't be recovered.
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async down(db) {
    await db.collection('TaskTemplate').updateMany(
      { type: 'PERIOD' },
      { $set: { type: 'SPECIFIC' } },
    );
  },
};
