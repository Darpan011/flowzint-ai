import {
  BarChart3,
  Flame,
  Users,
  Briefcase,
  Activity
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { useEffect, useState } from "react";

function App() {

  const [analytics, setAnalytics] = useState<any>(null);

  const [leads, setLeads] = useState<any[]>([]);

  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [timeline, setTimeline] = useState<any[]>([]);

  const [newStatus, setNewStatus] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const chartData = [

    {
      name: "NEW",
      value: leads.filter(
        (lead) => lead.status === "NEW"
      ).length
    },

    {
      name: "CONTACTED",
      value: leads.filter(
        (lead) => lead.status === "CONTACTED"
      ).length
    },

    {
      name: "QUALIFIED",
      value: leads.filter(
        (lead) => lead.status === "QUALIFIED"
      ).length
    },

    {
      name: "CLOSED",
      value: leads.filter(
        (lead) => lead.status === "CLOSED"
      ).length
    }

  ];

  const COLORS = [
    "#3b82f6",
    "#eab308",
    "#22c55e",
    "#ef4444"
  ];

  const filteredLeads = leads.filter((lead) => {

    const matchesSearch =

      lead.company
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =

      statusFilter === "ALL"
        ? true
        : lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const fetchAnalytics = async () => {

    const response = await fetch(
      "http://localhost:5003/analytics/summary"
    );

    const data = await response.json();

    setAnalytics(data.data);
  };

  const fetchLeads = async () => {

    const response = await fetch(
      "http://localhost:5003/lead"
    );

    const data = await response.json();

    setLeads(data.data);
  };

  const fetchTimeline = async (leadId: string) => {

    const response = await fetch(
      `http://localhost:5003/lead/${leadId}/timeline`
    );

    const data = await response.json();

    setTimeline(data.data);
  };

  const handleLeadClick = async (lead: any) => {

    setSelectedLead(lead);

    setNewStatus(lead.status);

    await fetchTimeline(lead.id);
  };

  const updateLeadStatus = async () => {

    if (!selectedLead) return;

    await fetch(
      `http://localhost:5003/lead/${selectedLead.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus
        })
      }
    );

    await fetchAnalytics();
    await fetchLeads();
    await fetchTimeline(selectedLead.id);

    alert("Lead updated");
  };

  useEffect(() => {

    fetchAnalytics();
    fetchLeads();

  }, []);

  return (

    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}

      <div className="w-64 border-r border-slate-800 p-6 hidden md:block">

        <h1 className="text-3xl font-bold mb-10">
          Flowzint 🚀
        </h1>

        <div className="space-y-4">

          <div className="flex items-center gap-3 text-slate-300 hover:text-white cursor-pointer">
            <BarChart3 size={20} />
            Dashboard
          </div>

          <div className="flex items-center gap-3 text-slate-300 hover:text-white cursor-pointer">
            <Users size={20} />
            Leads
          </div>

          <div className="flex items-center gap-3 text-slate-300 hover:text-white cursor-pointer">
            <Briefcase size={20} />
            CRM
          </div>

          <div className="flex items-center gap-3 text-slate-300 hover:text-white cursor-pointer">
            <Activity size={20} />
            Analytics
          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold mb-2">
              CRM Dashboard
            </h1>

            <p className="text-slate-400">
              Manage leads and customer activities
            </p>

          </div>

        </div>

        {/* ANALYTICS */}

        {analytics && (

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

            <Card
              title="Total Leads"
              value={analytics.totalLeads}
              icon={<Users />}
            />

            <Card
              title="Qualified"
              value={analytics.qualifiedLeads}
              icon={<BarChart3 />}
            />

            <Card
              title="Assigned"
              value={analytics.assignedLeads}
              icon={<Briefcase />}
            />

            <Card
              title="Hot Leads"
              value={analytics.hotLeads}
              icon={<Flame />}
            />

          </div>
        )}

        {/* TOOLBAR */}

        <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              bg-slate-900
              border border-slate-800
              rounded-2xl
              px-5 py-4
              w-full lg:w-[350px]
              outline-none
              focus:border-violet-500
              transition
            "
          />

          {/* FILTER */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              bg-slate-900
              border border-slate-800
              rounded-2xl
              px-5 py-4
              outline-none
              focus:border-violet-500
              transition
            "
          >

            <option value="ALL">All Status</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="CLOSED">CLOSED</option>

          </select>

        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* PIE CHART */}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-2xl font-semibold mb-6">
              Lead Status Distribution
            </h2>

            <div className="h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                  >

                    {chartData.map((_, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />

                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* INSIGHTS */}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-2xl font-semibold mb-6">
              AI Insights
            </h2>

            <div className="space-y-4">

              <div className="bg-slate-800 rounded-2xl p-4">

                <p className="text-violet-400 font-semibold mb-2">
                  Hot Leads
                </p>

                <p className="text-slate-300">
                  {analytics?.hotLeads} leads have high conversion potential.
                </p>

              </div>

              <div className="bg-slate-800 rounded-2xl p-4">

                <p className="text-green-400 font-semibold mb-2">
                  Qualification Rate
                </p>

                <p className="text-slate-300">

                  {analytics?.totalLeads > 0
                    ? Math.round(
                        (analytics?.qualifiedLeads /
                          analytics?.totalLeads) * 100
                      )
                    : 0}% of leads are qualified.

                </p>

              </div>

              <div className="bg-slate-800 rounded-2xl p-4">

                <p className="text-yellow-400 font-semibold mb-2">
                  Assignment Coverage
                </p>

                <p className="text-slate-300">

                  {analytics?.assignedLeads} leads currently assigned to sales reps.

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* LEADS TABLE */}

        <div className="grid grid-cols-1">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">

            <div className="p-6 border-b border-slate-800">

              <h2 className="text-2xl font-semibold">
                Leads
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-950">

                  <tr className="text-slate-400 text-left">

                    <th className="p-5">Company</th>
                    <th>Status</th>
                    <th>Assigned</th>
                    <th>Score</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredLeads.map((lead) => (

                    <tr
                      key={lead.id}
                      onClick={() => handleLeadClick(lead)}
                      className="border-t border-slate-800 hover:bg-slate-800/40 cursor-pointer transition"
                    >

                      <td className="p-5 font-medium">
                        {lead.company}
                      </td>

                      <td>

                        <span className={`
                          px-3 py-1 rounded-full text-sm
                          ${lead.status === "QUALIFIED"
                            ? "bg-green-500/20 text-green-400"
                            : lead.status === "CONTACTED"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : lead.status === "CLOSED"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"}
                        `}>
                          {lead.status}
                        </span>

                      </td>

                      <td>
                        {lead.assigned_to || "Unassigned"}
                      </td>

                      <td>

                        <span className="font-semibold">
                          {lead.score}
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      {/* DRAWER */}

      {selectedLead && (

        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50"
          onClick={() => setSelectedLead(null)}
        >

          <div
            className="w-[500px] h-full bg-slate-900 border-l border-slate-800 p-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}

            <div className="flex items-start justify-between mb-8">

              <div>

                <h2 className="text-3xl font-bold mb-2">
                  {selectedLead.company}
                </h2>

                <p className="text-slate-400">
                  {selectedLead.domain}
                </p>

              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>

            </div>

            {/* STATUS */}

            <div className="bg-slate-800 rounded-2xl p-5 mb-8 border border-slate-700">

              <p className="text-slate-400 mb-3">
                Lead Status
              </p>

              <div className="flex gap-3">

                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 flex-1"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <button
                  onClick={updateLeadStatus}
                  className="bg-violet-600 hover:bg-violet-500 px-5 py-3 rounded-xl font-medium transition"
                >
                  Update
                </button>

              </div>

            </div>

            {/* DETAILS */}

            <div className="grid grid-cols-2 gap-4 mb-8">

              <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">

                <p className="text-slate-400 text-sm mb-1">
                  Assigned To
                </p>

                <p className="font-semibold">
                  {selectedLead.assigned_to || "Unassigned"}
                </p>

              </div>

              <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">

                <p className="text-slate-400 text-sm mb-1">
                  Score
                </p>

                <p className="font-semibold">
                  {selectedLead.score}
                </p>

              </div>

            </div>

            {/* TIMELINE */}

            <div>

              <h3 className="text-xl font-semibold mb-6">
                Activity Timeline
              </h3>

              <div className="space-y-4">

                {timeline.map((activity) => (

                  <div
                    key={activity.id}
                    className="relative pl-6 border-l border-slate-700"
                  >

                    <div className="absolute w-3 h-3 bg-violet-500 rounded-full -left-[6px] top-1" />

                    <div className="pb-6">

                      <p className="text-violet-400 text-sm font-semibold mb-1">
                        {activity.type}
                      </p>

                      <p className="text-slate-200 mb-2">
                        {activity.message}
                      </p>

                      <p className="text-xs text-slate-500">
                        {activity.created_at}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function Card({
  title,
  value,
  icon
}: any) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-violet-500/50 transition">

      <div className="flex items-center justify-between mb-4">

        <div className="text-slate-400">
          {title}
        </div>

        <div className="text-violet-400">
          {icon}
        </div>

      </div>

      <div className="text-4xl font-bold">
        {value}
      </div>

    </div>
  );
}

export default App;