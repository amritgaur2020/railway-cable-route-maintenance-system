"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Filter, Calendar, Clock, User, Wrench, Play, CheckCircle, Eye, Edit, Trash2 } from 'lucide-react'

export function MaintenanceTasks() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [viewTaskOpen, setViewTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [viewMode, setViewMode] = useState('kanban')

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    assignee: '',
    dueDate: '',
    location: '',
    taskType: ''
  })

  const [tasks, setTasks] = useState([
    {
      id: 'MT-001',
      title: 'Cable Inspection - Section A12',
      description: 'Routine inspection of fiber optic cables in section A12',
      priority: 'high',
      status: 'pending',
      assignee: 'John Smith',
      dueDate: '2024-01-20',
      location: 'New Delhi - Gurgaon',
      taskType: 'inspection',
      createdDate: '2024-01-15'
    },
    {
      id: 'MT-002',
      title: 'Signal Equipment Maintenance',
      description: 'Replace faulty signal equipment at junction point',
      priority: 'critical',
      status: 'in-progress',
      assignee: 'Sarah Johnson',
      dueDate: '2024-01-18',
      location: 'Mumbai Central',
      taskType: 'repair',
      createdDate: '2024-01-14'
    },
    {
      id: 'MT-003',
      title: 'Preventive Maintenance - Route CR-001',
      description: 'Scheduled preventive maintenance for main line',
      priority: 'medium',
      status: 'completed',
      assignee: 'Mike Wilson',
      dueDate: '2024-01-16',
      location: 'Delhi-Mumbai Route',
      taskType: 'preventive',
      createdDate: '2024-01-10'
    }
  ])

  const handleAddTask = () => {
    if (!newTask.title || !newTask.priority || !newTask.assignee || !newTask.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const task = {
      id: `MT-${String(tasks.length + 1).padStart(3, '0')}`,
      ...newTask,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0]
    }

    setTasks([...tasks, task])
    toast({
      title: "Task Created Successfully",
      description: `Maintenance task "${newTask.title}" has been assigned to ${newTask.assignee}.`
    })
    
    setNewTask({
      title: '',
      description: '',
      priority: '',
      assignee: '',
      dueDate: '',
      location: '',
      taskType: ''
    })
    setAddTaskOpen(false)
  }

  const handleStartTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'in-progress' } : task
    ))
    toast({
      title: "Task Started",
      description: `Task ${taskId} is now in progress.`
    })
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'completed' } : task
    ))
    toast({
      title: "Task Completed",
      description: `Task ${taskId} has been marked as completed.`
    })
  }

  const handleViewTask = (task: any) => {
    setSelectedTask(task)
    setViewTaskOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast({
      title: "Task Deleted",
      description: `Task ${taskId} has been removed from the system.`
    })
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in-progress': return 'secondary'
      case 'pending': return 'outline'
      default: return 'outline'
    }
  }

  const TaskCard = ({ task }: { task: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription>{task.id}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} title={`${task.priority} priority`}></div>
            <Badge variant={getStatusColor(task.status)}>
              {task.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{task.description}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>{task.assignee}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Due: {task.dueDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Wrench className="w-4 h-4" />
            <span>{task.location}</span>
          </div>
          <div className="flex space-x-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => handleViewTask(task)}>
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            {task.status === 'pending' && (
              <Button size="sm" variant="outline" onClick={() => handleStartTask(task.id)}>
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
            )}
            {task.status === 'in-progress' && (
              <Button size="sm" variant="outline" onClick={() => handleCompleteTask(task.id)}>
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => handleDeleteTask(task.id)}>
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Tasks</h1>
          <p className="text-gray-600">Manage and track maintenance activities</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Maintenance Task</DialogTitle>
                <DialogDescription>
                  Schedule a new maintenance activity
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Cable Inspection - Section A12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Detailed task description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taskType">Task Type</Label>
                    <Select value={newTask.taskType} onValueChange={(value) => setNewTask({...newTask, taskType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="preventive">Preventive</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assignee *</Label>
                    <Select value={newTask.assignee} onValueChange={(value) => setNewTask({...newTask, assignee: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                        <SelectItem value="Lisa Brown">Lisa Brown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newTask.location}
                    onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                    placeholder="Station or route location"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pending Tasks */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                Pending ({filteredTasks.filter(t => t.status === 'pending').length})
              </h3>
              <div className="space-y-4">
                {filteredTasks.filter(task => task.status === 'pending').map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* In Progress Tasks */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Play className="w-5 h-5 mr-2 text-blue-500" />
                In Progress ({filteredTasks.filter(t => t.status === 'in-progress').length})
              </h3>
              <div className="space-y-4">
                {filteredTasks.filter(task => task.status === 'in-progress').map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Completed ({filteredTasks.filter(t => t.status === 'completed').length})
              </h3>
              <div className="space-y-4">
                {filteredTasks.filter(task => task.status === 'completed').map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Tasks organized by due date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Details Dialog */}
      <Dialog open={viewTaskOpen} onOpenChange={setViewTaskOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Task ID</Label>
                  <p className="text-sm text-gray-600">{selectedTask.id}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge variant={getStatusColor(selectedTask.status)} className="ml-2">
                    {selectedTask.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="font-medium">Title</Label>
                <p className="text-sm text-gray-600">{selectedTask.title}</p>
              </div>
              <div>
                <Label className="font-medium">Description</Label>
                <p className="text-sm text-gray-600">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Priority</Label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedTask.priority)}`}></div>
                    <span className="text-sm text-gray-600 capitalize">{selectedTask.priority}</span>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Task Type</Label>
                  <p className="text-sm text-gray-600 capitalize">{selectedTask.taskType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Assignee</Label>
                  <p className="text-sm text-gray-600">{selectedTask.assignee}</p>
                </div>
                <div>
                  <Label className="font-medium">Due Date</Label>
                  <p className="text-sm text-gray-600">{selectedTask.dueDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Location</Label>
                  <p className="text-sm text-gray-600">{selectedTask.location}</p>
                </div>
                <div>
                  <Label className="font-medium">Created Date</Label>
                  <p className="text-sm text-gray-600">{selectedTask.createdDate}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTaskOpen(false)}>Close</Button>
            {selectedTask?.status === 'pending' && (
              <Button onClick={() => {
                handleStartTask(selectedTask.id)
                setViewTaskOpen(false)
              }}>
                Start Task
              </Button>
            )}
            {selectedTask?.status === 'in-progress' && (
              <Button onClick={() => {
                handleCompleteTask(selectedTask.id)
                setViewTaskOpen(false)
              }}>
                Complete Task
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
