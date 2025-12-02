import React, { useState, useEffect } from "react";
import axios from "@/api/axiosInstance";
import {
  Loader2,
  Users,
  Home,
  MessageSquare,
  ShieldCheck,
  Eye,
  Trash2,
  LayoutDashboard,
  List,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const adminTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "properties", label: "Properties", icon: Home }
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadedOnce) {
      loadData();
      setLoadedOnce(true);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, propsRes] = await Promise.all([
        axios.get("/admin/stats"),
        axios.get("/admin/users"),
        axios.get("/admin/properties")
      ]);

      const sortedUsers = usersRes.data.sort((a, b) => {
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setStats(statsRes.data);
      setUsers(sortedUsers);
      setProperties(propsRes.data);
    } catch {
      toast.error("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await axios.delete(`/admin/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success("Property deleted");
    } catch {
      toast.error("Failed to delete property");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );

  const OverviewTab = () => {
    if (!stats) return <div className="text-center py-16">Failed to load stats.</div>;

    return (
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
            <CardTitle className="text-sm">Properties</CardTitle>
            <Home className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProperties}</div>
            <p className="text-sm text-muted-foreground mt-1">
              <List className="inline h-3 w-3 mr-1" />
              Active Listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm">Messages</CardTitle>
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
            <CardTitle className="text-sm">New Users</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{stats.newUsers}</div>
            <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const UsersTab = () => (
    <div>
      <div className="hidden md:block bg-card border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-muted/40">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.profilePic || "https://i.imgur.com/6VBx3io.png"}
                      className="h-10 w-10 rounded-full border"
                    />
                    <div>
                      <div className="font-medium">{u.name}</div>
                      {u.isAdmin && (
                        <Badge className="text-xs bg-indigo-600">Admin</Badge>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-muted-foreground">{u.email}</td>

                <td className="px-6 py-4">
                  <Badge variant={u.verified ? "success" : "outline"}>
                    {u.verified ? "Verified" : "Unverified"}
                  </Badge>
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/profile/${u._id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!u.isAdmin && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteUser(u._id)}
                      >
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

      <div className="md:hidden space-y-4">
        {users.map((u) => (
          <Card key={u._id} className="p-4">
            <div className="flex items-center gap-3">
              <img
                src={u.profilePic || "https://i.imgur.com/6VBx3io.png"}
                className="h-12 w-12 rounded-full border"
              />
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <Badge variant={u.verified ? "success" : "outline"}>
                {u.verified ? "Verified" : "Unverified"}
              </Badge>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/profile/${u._id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {!u.isAdmin && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteUser(u._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const PropertiesTab = () => (
    <div>
      <div className="hidden md:block bg-card border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase">Property</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Rent</th>
              <th className="px-6 py-3">Posted</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {properties.map((p) => (
              <tr key={p._id} className="hover:bg-muted/40">
                <td className="px-6 py-4 font-medium truncate max-w-[200px]">{p.title}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.lister?.name || "Unknown"}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.location}</td>
                <td className="px-6 py-4 font-semibold">₹{p.rent.toLocaleString()}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/properties/${p._id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteProperty(p._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {properties.map((p) => (
          <Card key={p._id} className="p-4">
            <p className="font-semibold truncate">{p.title}</p>
            <p className="text-xs text-muted-foreground">{p.location}</p>

            <div className="flex justify-between items-center mt-3">
              <p className="font-semibold text-primary">₹{p.rent.toLocaleString()}</p>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => navigate(`/properties/${p._id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteProperty(p._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-56 fixed top-0 left-0 h-full bg-card border-r shadow-sm flex-col pt-28 px-4">
        <div className="flex items-center gap-2 mb-8">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Admin</h2>
        </div>

        <nav className="space-y-1">
          {adminTabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full p-3 rounded-lg text-sm ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted/70"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <Separator className="my-6" />

        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/")}>
          <Home className="h-4 w-4 mr-2" /> Home
        </Button>
      </aside>

      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-card border-b flex justify-around py-2">
        {adminTabs.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center text-xs px-2 ${
                activeTab === item.id ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4 mb-1" />
              {item.label}
            </button>
          );
        })}
      </div>

      <main className="flex-1 ml-0 md:ml-56 p-4 md:p-12 pt-28 md:pt-32">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "properties" && <PropertiesTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
