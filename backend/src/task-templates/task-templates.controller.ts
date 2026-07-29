import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
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
import { TaskTemplatesService } from './task-templates.service';
import { CreateTaskTemplateDto } from './dto/create-task-template.dto';
import { UpdateTaskTemplateDto } from './dto/update-task-template.dto';
import { TaskTemplateEntity } from './entities/task-template.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('task-templates')
@ApiBearerAuth()
@Controller('task-templates')
export class TaskTemplatesController {
  constructor(private readonly taskTemplatesService: TaskTemplatesService) {}

  @Post()
  @ApiOperation({
    summary:
      "Create a task template for the current user; also spawns today's task instance if it applies",
  })
  @ApiResponse({ status: 201, type: TaskTemplateEntity })
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateTaskTemplateDto,
  ) {
    return this.taskTemplatesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List task templates belonging to the current user',
  })
  @ApiResponse({ status: 200, type: [TaskTemplateEntity] })
  findAll(@CurrentUser('userId') userId: string) {
    return this.taskTemplatesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task template by id' })
  @ApiParam({ name: 'id', description: 'Task template id' })
  @ApiResponse({ status: 200, type: TaskTemplateEntity })
  @ApiResponse({ status: 404, description: 'Task template not found' })
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.taskTemplatesService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task template' })
  @ApiParam({ name: 'id', description: 'Task template id' })
  @ApiResponse({ status: 200, type: TaskTemplateEntity })
  @ApiResponse({ status: 404, description: 'Task template not found' })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskTemplateDto,
  ) {
    return this.taskTemplatesService.update(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a task template and all of its task instances',
  })
  @ApiParam({ name: 'id', description: 'Task template id' })
  @ApiResponse({ status: 204, description: 'Task template deleted' })
  @ApiResponse({ status: 404, description: 'Task template not found' })
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.taskTemplatesService.remove(userId, id);
  }
}
