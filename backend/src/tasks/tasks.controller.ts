import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskEntity } from './entities/task.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({
    summary:
      'List task instances for a day, creating any missing recurring occurrences first',
  })
  @ApiResponse({ status: 200, type: [TaskEntity] })
  findAll(@CurrentUser('userId') userId: string, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task instance by id' })
  @ApiParam({ name: 'id', description: 'Task id' })
  @ApiResponse({ status: 200, type: TaskEntity })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.tasksService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a task instance's status" })
  @ApiParam({ name: 'id', description: 'Task id' })
  @ApiResponse({ status: 200, type: TaskEntity })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a single day's task instance" })
  @ApiParam({ name: 'id', description: 'Task id' })
  @ApiResponse({ status: 204, description: 'Task deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.tasksService.remove(userId, id);
  }
}
