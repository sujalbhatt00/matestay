import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import { 
  Loader2, Users, Home, MessageSquare, ShieldCheck, Eye, Trash2,
  LayoutDashboard, List, CircleDollarSign, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const adminNavItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Manage Users', icon: Users },
  { id: 'properties', label: 'Manage Properties', icon: Home },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, propsRes] = await Promise.all([
        axios.get('/admin/stats'),
        axios.get('/admin/users'),
        axios.get('/admin/properties'),
      ]);
      setStats(statsRes.data);

      const sortedUsers = usersRes.data.sort((a, b) => {
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setUsers(sortedUsers);

      setProperties(propsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: This will permanently delete the user and ALL their data. Continue?')) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await axios.delete(`/admin/properties/${propertyId}`);
      setProperties(properties.filter(p => p._id !== propertyId));
      toast.success('Property deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-sm">Total Users</CardTitle>
          <Users className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalUsers}</div>
          <p className="text-sm text-muted-foreground mt-1">
            <CheckCircle className="inline h-3 w-3 mr-1" />
            {stats.verifiedUsers} Verified
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-sm">Total Properties</CardTitle>
          <Home className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalProperties}</div>
          <p className="text-sm text-muted-foreground mt-1">
            <List className="inline h-3 w-3 mr-1" />
            {stats.totalProperties} Active Listings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-sm">Total Messages</CardTitle>
          <MessageSquare className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalMessages}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.totalConversations} Conversations
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-sm">New Users (7 days)</CardTitle>
          <Users className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">+{stats.newUsers}</div>
          <p className="text-sm text-muted-foreground mt-1">Since last week</p>
        </CardContent>
      </Card>
    </div>
  );

  const UsersTab = () => (
    <div className="bg-card border rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={user.profilePic || 'https://i.imgur.com/6VBx3io.png'}
                      className="h-10 w-10 rounded-full mr-3 border"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      {user.isAdmin && (
                        <Badge className="text-xs bg-indigo-500">Admin</Badge>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>

                <td className="px-6 py-4">
                  <Badge variant={user.verified ? 'success' : 'outline'}>
                    {user.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigate(`/profile/${user._id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>

                    {!user.isAdmin && (
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PropertiesTab = () => (
    <div className="bg-card border rounded-lg">
      <div className="overflow-x-auto">

        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase text-muted-foreground">Property</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Rent</th>
              <th className="px-6 py-3">Posted</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {properties.map(property => (
              <tr key={property._id} className="hover:bg-muted/50">

                {/* Removed Images */}
                <td className="px-6 py-4">
                  <div className="font-medium truncate max-w-[200px]">
                    {property.title}
                  </div>
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {property.lister?.name || 'Unknown'}
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {property.location}
                </td>

                {/* Removed Dollar Icon */}
                <td className="px-6 py-4 font-semibold">
                  ₹{property.rent.toLocaleString()}
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(property.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigate(`/properties/${property._id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button variant="destructive" size="icon" onClick={() => handleDeleteProperty(property._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen pt-28">

      {/* Sidebar */}
      <aside className="w-64 fixed top-0 left-0 h-full pt-28 bg-card border-r shadow-lg">

        <div className="px-4 py-6">
          <div className="flex items-center gap-2 mb-8">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Admin Console</h2>
          </div>

          <nav className="space-y-1">
            {adminNavItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full p-3 rounded-lg ${
                    activeTab === item.id 
                      ? 'bg-primary text-primary-foreground font-semibold shadow'
                      : 'text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}

                  {item.id === 'users' && <Badge className="ml-auto">{users.length}</Badge>}
                  {item.id === 'properties' && <Badge className="ml-auto">{properties.length}</Badge>}
                </button>
              );
            })}
          </nav>

          <Separator className="my-6" />

          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" /> Go to Homepage
          </Button>
        </div>

      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-12">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">
            {adminNavItems.find(i => i.id === activeTab)?.label}
          </h1>
          <p className="text-muted-foreground">
            Manage your application's {activeTab} data.
          </p>
        </header>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'properties' && <PropertiesTab />}
      </main>

    </div>
  );
};

export default AdminDashboard;
