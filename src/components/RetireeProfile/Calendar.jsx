import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Bell, Plus, Edit, Trash2, Eye, Check, X, Filter, Search, Settings, Award, BarChart3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const RetireeCalendar = () => {
  const { theme } = useTheme();
  const [currentUser] = useState({
    id: 'admin1',
    role: 'admin', // Switch to 'retiree' to see retiree view
    name: 'Admin Sarah'
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample events data
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Morning Yoga Class',
      date: '2025-06-12',
      time: '09:00',
      duration: 60,
      location: 'Community Center - Room A',
      description: 'Gentle yoga session for all fitness levels',
      category: 'fitness',
      createdBy: 'admin1',
      maxParticipants: 15,
      participants: ['ret1', 'ret2', 'ret3'],
      status: 'open',
      recurring: 'weekly',
      color: 'blue'
    },
    {
      id: '2',
      title: 'Book Club Discussion',
      date: '2025-06-15',
      time: '14:00',
      duration: 90,
      location: 'Library Meeting Room',
      description: 'Discussing "The Thursday Murder Club"',
      category: 'social',
      createdBy: 'admin2',
      maxParticipants: 12,
      participants: ['ret1', 'ret4', 'ret5', 'ret6'],
      status: 'open',
      recurring: 'monthly',
      color: 'green'
    },
    {
      id: '3',
      title: 'Garden Club Meet',
      date: '2025-06-18',
      time: '10:30',
      duration: 120,
      location: 'Community Garden',
      description: 'Spring planting and maintenance',
      category: 'hobby',
      createdBy: 'ret1',
      maxParticipants: 8,
      participants: ['ret1', 'ret2'],
      status: 'pending',
      recurring: 'none',
      color: 'yellow'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    location: '',
    description: '',
    category: 'social',
    maxParticipants: 10,
    recurring: 'none'
  });

  // Get calendar days for current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return events.filter(event => {
      if (currentUser.role === 'retiree') {
        return event.date === dateStr && (
          event.participants.includes(currentUser.id) ||
          event.createdBy === currentUser.id
        );
      }
      return event.date === dateStr;
    }).filter(event => {
      if (filter === 'all') return true;
      if (filter === 'created') return event.createdBy === currentUser.id;
      if (filter === 'joined') return event.participants.includes(currentUser.id);
      if (filter === 'pending') return event.status === 'pending';
      return event.category === filter;
    }).filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Event color mapping
  const getEventColor = (event) => {
    if (currentUser.role === 'admin') {
      if (event.createdBy === currentUser.id) return 'bg-blue-500';
      if (event.createdBy.startsWith('admin')) return 'bg-green-500';
      return 'bg-yellow-500'; // Retiree submitted
    } else {
      if (event.participants.includes(currentUser.id)) return 'bg-green-500';
      if (event.status === 'pending') return 'bg-orange-500';
      return 'bg-gray-400';
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleJoinEvent = (eventId) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, participants: [...event.participants, currentUser.id] }
        : event
    ));
  };

  const handleLeaveEvent = (eventId) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, participants: event.participants.filter(p => p !== currentUser.id) }
        : event
    ));
  };

  const handleApproveEvent = (eventId) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'open' }
        : event
    ));
  };

  const handleCreateEvent = () => {
    const event = {
      ...newEvent,
      id: Date.now().toString(),
      createdBy: currentUser.id,
      participants: [currentUser.id],
      status: currentUser.role === 'admin' ? 'open' : 'pending',
      color: currentUser.role === 'admin' ? 'blue' : 'yellow'
    };
    
    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      duration: 60,
      location: '',
      description: '',
      category: 'social',
      maxParticipants: 10,
      recurring: 'none'
    });
    setShowCreateModal(false);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              <Calendar className="text-blue-600" />
              Retiree Activity Calendar
            </h1>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              Welcome back, {currentUser.name} ({currentUser.role})
            </p>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <BarChart3 size={20} />
                Dashboard
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <Plus size={20} />
                Create Event
              </button>
            </div>
          )}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search size={20} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`border rounded-lg px-3 py-2 w-64 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className={`border rounded-lg px-3 py-2 ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">All Events</option>
            {isAdmin ? (
              <>
                <option value="created">Created by Me</option>
                <option value="pending">Pending Approval</option>
              </>
            ) : (
              <>
                <option value="joined">My Events</option>
                <option value="created">Created by Me</option>
              </>
            )}
            <option value="fitness">Fitness</option>
            <option value="social">Social</option>
            <option value="hobby">Hobbies</option>
            <option value="educational">Educational</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded ${
                viewMode === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 mb-6`}>
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigateMonth(-1)}
            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100'}`}
          >
            ←
          </button>
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            onClick={() => navigateMonth(1)}
            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100'}`}
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
        {/* Day Headers */}
        <div className={`grid grid-cols-7 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={`p-4 text-center font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {getDaysInMonth().map((day, index) => {
            const dayEvents = getEventsForDate(day);
            
            return (
              <div
                key={index}
                className={`min-h-32 p-2 border-b border-r ${
                  theme === 'dark' 
                    ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`${getEventColor(event)} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          <div className="flex items-center gap-1">
                            <Clock size={10} />
                            {event.time}
                          </div>
                          <div className="truncate font-medium">
                            {event.title}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 mt-6`}>
        <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Legend</h3>
        <div className="flex flex-wrap gap-4">
          {isAdmin ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Created by me</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Created by other admins</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Retiree submissions</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Joined events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pending approval</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Past events</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedEvent.title}</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className={theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Clock size={16} />
                {selectedEvent.date} at {selectedEvent.time} ({selectedEvent.duration} min)
              </div>
              <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <MapPin size={16} />
                {selectedEvent.location}
              </div>
              <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Users size={16} />
                {selectedEvent.participants.length}/{selectedEvent.maxParticipants} participants
              </div>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{selectedEvent.description}</p>
            </div>

            <div className="flex gap-2">
              {isAdmin ? (
                <>
                  {selectedEvent.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleApproveEvent(selectedEvent.id);
                        setShowEventModal(false);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                  )}
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Edit size={16} />
                    Edit
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  {selectedEvent.participants.includes(currentUser.id) ? (
                    <button
                      onClick={() => {
                        handleLeaveEvent(selectedEvent.id);
                        setShowEventModal(false);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Leave Event
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleJoinEvent(selectedEvent.id);
                        setShowEventModal(false);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      disabled={selectedEvent.participants.length >= selectedEvent.maxParticipants}
                    >
                      {selectedEvent.participants.length >= selectedEvent.maxParticipants ? 'Full' : 'Join Event'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4 max-h-screen overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Create New Event</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className={theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300'
                }`}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className={`border rounded-lg px-3 py-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className={`border rounded-lg px-3 py-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300'
                }`}
              />

              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 h-20 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300'
                }`}
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                  className={`border rounded-lg px-3 py-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="social">Social</option>
                  <option value="fitness">Fitness</option>
                  <option value="hobby">Hobby</option>
                  <option value="educational">Educational</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Max participants"
                  value={newEvent.maxParticipants}
                  onChange={(e) => setNewEvent({...newEvent, maxParticipants: parseInt(e.target.value)})}
                  className={`border rounded-lg px-3 py-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <select
                value={newEvent.recurring}
                onChange={(e) => setNewEvent({...newEvent, recurring: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="none">One-time event</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleCreateEvent}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1"
                  disabled={!newEvent.title || !newEvent.date || !newEvent.time}
                >
                  Create Event
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetireeCalendar;