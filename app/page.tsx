"use client";

import { useState } from "react";
import { PlusCircle, Calendar, CheckCircle2, Circle, Trash2, AlertCircle, Pencil, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: Date | null;
}

interface EditingTodo extends Todo {
  editText: string;
  editPriority: "low" | "medium" | "high";
  editDueDate: Date | null;
}

type FilterStatus = "all" | "active" | "completed";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [date, setDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [editingTodo, setEditingTodo] = useState<EditingTodo | null>(null);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          priority,
          dueDate: date,
        },
      ]);
      setNewTodo("");
      setDate(null);
      setPriority("medium");
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo({
      ...todo,
      editText: todo.text,
      editPriority: todo.priority,
      editDueDate: todo.dueDate,
    });
  };

  const cancelEditing = () => {
    setEditingTodo(null);
  };

  const saveEdit = () => {
    if (editingTodo && editingTodo.editText.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo.id
            ? {
                ...todo,
                text: editingTodo.editText,
                priority: editingTodo.editPriority,
                dueDate: editingTodo.editDueDate,
              }
            : todo
        )
      );
      setEditingTodo(null);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filterStatus) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const todoStats = {
    all: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Task Master
        </h1>

        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                className="w-full"
              />
            </div>
            
            <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button onClick={addTodo} className="bg-indigo-600 hover:bg-indigo-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </Card>

        <Card className="p-4 mb-6">
          <Tabs value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({todoStats.all})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({todoStats.active})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({todoStats.completed})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <Card
              key={todo.id}
              className={cn(
                "p-4 flex items-center justify-between transition-all",
                todo.completed && "bg-gray-50"
              )}
            >
              {editingTodo?.id === todo.id ? (
                <div className="flex-1 flex items-center gap-4">
                  <Input
                    value={editingTodo.editText}
                    onChange={(e) =>
                      setEditingTodo({
                        ...editingTodo,
                        editText: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                  <Select
                    value={editingTodo.editPriority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setEditingTodo({
                        ...editingTodo,
                        editPriority: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[140px] justify-start text-left font-normal",
                          !editingTodo.editDueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingTodo.editDueDate ? (
                          format(editingTodo.editDueDate, "PPP")
                        ) : (
                          <span>Due date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={editingTodo.editDueDate}
                        onSelect={(date) =>
                          setEditingTodo({
                            ...editingTodo,
                            editDueDate: date,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Save className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cancelEditing}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => toggleTodo(todo.id)}>
                      {todo.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                    <div>
                      <p
                        className={cn(
                          "text-lg",
                          todo.completed && "line-through text-gray-400"
                        )}
                      >
                        {todo.text}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={getPriorityColor(todo.priority)}
                        >
                          <AlertCircle className="mr-1 h-3 w-3" />
                          {todo.priority}
                        </Badge>
                        {todo.dueDate && (
                          <Badge variant="outline" className="text-blue-500">
                            <Calendar className="mr-1 h-3 w-3" />
                            {format(todo.dueDate, "MMM d")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(todo)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}

          {filteredTodos.length === 0 && (
            <Card className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">No tasks found</p>
              <p className="text-sm">
                {filterStatus === "all" 
                  ? "Add a new task to get started!"
                  : filterStatus === "active"
                    ? "No active tasks - great job!"
                    : "No completed tasks yet"}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}