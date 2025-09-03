"use client"

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  User,
  Mail,
  Plus,
  Send,
  Paperclip,
  Star
} from 'lucide-react';

interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: 'leader' | 'member';
  avatar: string;
  status: 'online' | 'offline';
}

interface GroupProject {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  status: 'active' | 'completed' | 'overdue';
  progress: number;
  members: GroupMember[];
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
}

const GroupWorkPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'members' | 'chat'>('overview');
  const [newMessage, setNewMessage] = useState('');

  // Mock data
  const mockGroups: GroupProject[] = [
    {
      id: '1',
      title: 'E-commerce Website Development',
      course: 'Advanced React Development',
      description: 'Build a full-stack e-commerce application using React, Node.js, and MongoDB. Include user authentication, product catalog, shopping cart, and payment integration.',
      dueDate: '2024-02-15',
      status: 'active',
      progress: 65,
      members: [
        {
          id: '1',
          name: 'Sarah Williams',
          email: 'sarah.williams@email.com',
          role: 'leader',
          avatar: '👩‍💼',
          status: 'online'
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          role: 'member',
          avatar: '👨‍💻',
          status: 'online'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@email.com',
          role: 'member',
          avatar: '👩‍🎨',
          status: 'offline'
        },
        {
          id: '4',
          name: 'David Kim',
          email: 'david.kim@email.com',
          role: 'member',
          avatar: '👨‍🔬',
          status: 'online'
        }
      ],
      tasks: [
        {
          id: '1',
          title: 'Design user interface mockups',
          assignedTo: 'Emily Rodriguez',
          status: 'completed',
          dueDate: '2024-01-20'
        },
        {
          id: '2',
          title: 'Set up React project structure',
          assignedTo: 'Mike Chen',
          status: 'completed',
          dueDate: '2024-01-25'
        },
        {
          id: '3',
          title: 'Implement user authentication',
          assignedTo: 'Sarah Williams',
          status: 'in-progress',
          dueDate: '2024-02-05'
        },
        {
          id: '4',
          title: 'Create product catalog API',
          assignedTo: 'David Kim',
          status: 'in-progress',
          dueDate: '2024-02-08'
        },
        {
          id: '5',
          title: 'Implement shopping cart functionality',
          assignedTo: 'Mike Chen',
          status: 'todo',
          dueDate: '2024-02-12'
        }
      ]
    }
  ];

  const currentGroup = mockGroups[0]; // For demo, using first group

  const mockMessages = [
    {
      id: '1',
      sender: 'Sarah Williams',
      message: 'Hey everyone! I\'ve made good progress on the authentication system. Should have it ready by tomorrow.',
      timestamp: '2024-01-16 14:30',
      avatar: '👩‍💼'
    },
    {
      id: '2',
      sender: 'Mike Chen',
      message: 'Great work Sarah! I\'ll start working on the shopping cart once the auth is done.',
      timestamp: '2024-01-16 14:32',
      avatar: '👨‍💻'
    },
    {
      id: '3',
      sender: 'David Kim',
      message: 'The API is coming along well. I\'ve got the basic CRUD operations working for products.',
      timestamp: '2024-01-16 15:15',
      avatar: '👨‍🔬'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'todo': return 'text-gray-600 bg-gray-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Group Work</h1>
        </div>
        <p className="text-gray-600">Collaborate with your team members on course projects</p>
      </div>

      {/* Group Overview Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentGroup.title}</h2>
            <p className="text-blue-600 font-medium mb-2">{currentGroup.course}</p>
            <p className="text-gray-600 mb-4">{currentGroup.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Due: {formatDate(currentGroup.dueDate)}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  getDaysUntilDue(currentGroup.dueDate) <= 7 ? 'bg-red-100 text-red-600' : 
                  getDaysUntilDue(currentGroup.dueDate) <= 14 ? 'bg-orange-100 text-orange-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {getDaysUntilDue(currentGroup.dueDate)} days left
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{currentGroup.members.length} members</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-1">{currentGroup.progress}%</div>
            <div className="text-sm text-gray-600 mb-2">Complete</div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${currentGroup.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: FileText },
            { key: 'tasks', label: 'Tasks', icon: CheckCircle2 },
            { key: 'members', label: 'Members', icon: Users },
            { key: 'chat', label: 'Chat', icon: MessageCircle }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 transition-colors ${
                activeTab === key 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Task completed</p>
                  <p className="text-xs text-gray-600">Emily finished Design user interface mockups</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">New message</p>
                  <p className="text-xs text-gray-600">David shared API progress update</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Deadline reminder</p>
                  <p className="text-xs text-gray-600">User authentication due in 3 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">2</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">1</div>
                <div className="text-sm text-gray-600">To Do</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">30</div>
                <div className="text-sm text-gray-600">Days Left</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {currentGroup.tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignedTo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      {task.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentGroup.members.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{member.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      {member.role === 'leader' && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                      <span className={`h-2 w-2 rounded-full ${
                        member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                    </div>
                    <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      member.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Team Chat</h3>
          </div>
          
          {/* Messages */}
          <div className="p-6 h-96 overflow-y-auto">
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="text-2xl">{message.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{message.sender}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
                      {message.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Paperclip className="h-5 w-5" />
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupWorkPage;