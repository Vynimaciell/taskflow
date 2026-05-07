import { useState, useEffect, useRef } from "react";

const COLUMNS = [
  { id: "TODO", label: "To Do", icon: "○", accent: "#6366f1" },
  { id: "IN_PROGRESS", label: "In Progress", icon: "◐", accent: "#f59e0b" },
  { id: "REVIEW", label: "Review", icon: "◑", accent: "#8b5cf6" },
  { id: "DONE", label: "Done", icon: "●", accent: "#10b981" },
];

const PRIORITIES = [
  { id: "LOW", label: "Low", color: "#94a3b8" },
  { id: "MEDIUM", label: "Medium", color: "#f59e0b" },
  { id: "HIGH", label: "High", color: "#ef4444" },
];

const TAGS = ["Frontend", "Backend", "Bug", "Feature", "DevOps", "Design", "Testing", "Docs"];

const initialTasks = [
  { id: 1, title: "Setup Spring Boot project", description: "Initialize with Spring Initializr, add dependencies", status: "DONE", priority: "HIGH", tags: ["Backend", "DevOps"], createdAt: "2026-04-28" },
  { id: 2, title: "Design database schema", description: "Create ERD for tasks, users, and tags", status: "DONE", priority: "HIGH", tags: ["Backend"], createdAt: "2026-04-29" },
  { id: 3, title: "Implement REST API endpoints", description: "CRUD operations for tasks with validation", status: "IN_PROGRESS", priority: "HIGH", tags: ["Backend"], createdAt: "2026-04-30" },
  { id: 4, title: "Build Kanban board UI", description: "Drag and drop columns with smooth animations", status: "IN_PROGRESS", priority: "MEDIUM", tags: ["Frontend", "Design"], createdAt: "2026-05-01" },
  { id: 5, title: "Add authentication with JWT", description: "Login/register flow with token refresh", status: "TODO", priority: "HIGH", tags: ["Backend", "Feature"], createdAt: "2026-05-02" },
  { id: 6, title: "Write unit tests for services", description: "JUnit 5 + Mockito for service layer", status: "TODO", priority: "MEDIUM", tags: ["Backend", "Testing"], createdAt: "2026-05-02" },
  { id: 7, title: "Setup CI/CD pipeline", description: "GitHub Actions for build and deploy", status: "TODO", priority: "LOW", tags: ["DevOps"], createdAt: "2026-05-03" },
  { id: 8, title: "Code review: API layer", description: "Review controller + DTO patterns", status: "REVIEW", priority: "MEDIUM", tags: ["Backend"], createdAt: "2026-05-01" },
  { id: 9, title: "Fix CORS configuration", description: "Allow frontend origin in Spring Security", status: "REVIEW", priority: "HIGH", tags: ["Backend", "Bug"], createdAt: "2026-05-03" },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [filterPriority, setFilterPriority] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);
  const nextId = useRef(10);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filterTag && !t.tags.includes(filterTag)) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getColumnTasks = (colId) => filteredTasks.filter((t) => t.status === colId);

  const handleDragStart = (task) => setDraggedTask(task);
  const handleDragOver = (e, colId) => { e.preventDefault(); setDragOverCol(colId); };
  const handleDragLeave = () => setDragOverCol(null);
  const handleDrop = (colId) => {
    if (draggedTask) {
      setTasks((prev) => prev.map((t) => (t.id === draggedTask.id ? { ...t, status: colId } : t)));
    }
    setDraggedTask(null);
    setDragOverCol(null);
  };

  const saveTask = (taskData) => {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t)));
    } else {
      setTasks((prev) => [...prev, { ...taskData, id: nextId.current++, createdAt: new Date().toISOString().slice(0, 10) }]);
    }
    setShowModal(false);
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setShowModal(false);
    setEditingTask(null);
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0f; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 10px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes scaleIn { from { opacity:0; transform: scale(0.95); } to { opacity:1; transform: scale(1); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important; }
        .card { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
        .col-drop { transition: all 0.3s ease; }
        .tag:hover { opacity: 0.8; transform: scale(1.05); }
        .tag { transition: all 0.15s ease; cursor: default; }
        .btn-add:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(99,102,241,0.4); }
        .btn-add { transition: all 0.2s ease; }
        .filter-chip { transition: all 0.15s ease; cursor: pointer; }
        .filter-chip:hover { opacity: 0.9; }
      `}</style>

      {/* Header */}
      <header style={{ ...styles.header, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-20px)", transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            </div>
            <div>
              <h1 style={styles.title}>TaskFlow</h1>
              <p style={styles.subtitle}>Kanban Board</p>
            </div>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.progressWrap}>
            <span style={styles.progressLabel}>{progress}% complete</span>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
            <span style={styles.progressCount}>{doneTasks}/{totalTasks}</span>
          </div>
          <button className="btn-add" style={styles.addBtn} onClick={() => { setEditingTask(null); setShowModal(true); }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Task
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div style={{ ...styles.toolbar, opacity: mounted ? 1 : 0, transition: "all 0.6s 0.1s ease" }}>
        <div style={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input style={styles.searchInput} placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          {searchQuery && <button style={styles.clearBtn} onClick={() => setSearchQuery("")}>×</button>}
        </div>
        <button className="filter-chip" style={{ ...styles.filterToggle, background: showFilters ? "#1e1b4b" : "transparent", borderColor: showFilters ? "#6366f1" : "#1e1e2e" }} onClick={() => setShowFilters(!showFilters)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filters
          {(filterTag || filterPriority) && <span style={styles.filterBadge}>{(filterTag ? 1 : 0) + (filterPriority ? 1 : 0)}</span>}
        </button>
      </div>

      {showFilters && (
        <div style={styles.filtersPanel}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Priority</span>
            <div style={styles.filterChips}>
              {PRIORITIES.map((p) => (
                <button key={p.id} className="filter-chip" style={{ ...styles.chip, background: filterPriority === p.id ? p.color + "22" : "#0f0f18", borderColor: filterPriority === p.id ? p.color : "#1e1e2e", color: filterPriority === p.id ? p.color : "#94a3b8" }} onClick={() => setFilterPriority(filterPriority === p.id ? null : p.id)}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} /> {p.label}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Tag</span>
            <div style={styles.filterChips}>
              {TAGS.map((tag) => (
                <button key={tag} className="filter-chip" style={{ ...styles.chip, background: filterTag === tag ? "#6366f122" : "#0f0f18", borderColor: filterTag === tag ? "#6366f1" : "#1e1e2e", color: filterTag === tag ? "#c7d2fe" : "#94a3b8" }} onClick={() => setFilterTag(filterTag === tag ? null : tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {(filterTag || filterPriority) && (
            <button style={styles.clearFilters} onClick={() => { setFilterTag(null); setFilterPriority(null); }}>Clear all filters</button>
          )}
        </div>
      )}

      {/* Board */}
      <div style={styles.board}>
        {COLUMNS.map((col, ci) => {
          const colTasks = getColumnTasks(col.id);
          const isOver = dragOverCol === col.id;
          return (
            <div key={col.id} className="col-drop" style={{ ...styles.column, animation: mounted ? `fadeUp 0.5s ${ci * 0.1}s both` : "none", borderColor: isOver ? col.accent + "66" : "#1a1a2e", background: isOver ? col.accent + "08" : "#0d0d16" }}
              onDragOver={(e) => handleDragOver(e, col.id)} onDragLeave={handleDragLeave} onDrop={() => handleDrop(col.id)}>
              <div style={styles.colHeader}>
                <div style={styles.colTitle}>
                  <span style={{ ...styles.colIcon, color: col.accent }}>{col.icon}</span>
                  <span style={styles.colName}>{col.label}</span>
                  <span style={{ ...styles.colCount, background: col.accent + "18", color: col.accent }}>{colTasks.length}</span>
                </div>
                <button style={styles.colAddBtn} onClick={() => { setEditingTask({ status: col.id }); setShowModal(true); }} title="Add task">+</button>
              </div>
              <div style={styles.colBody}>
                {colTasks.map((task, ti) => (
                  <TaskCard key={task.id} task={task} accent={col.accent} index={ti} onEdit={() => { setEditingTask(task); setShowModal(true); }} onDragStart={() => handleDragStart(task)} isDragging={draggedTask?.id === task.id} />
                ))}
                {colTasks.length === 0 && (
                  <div style={styles.emptyCol}>
                    <span style={{ fontSize: 24, opacity: 0.3 }}>{col.icon}</span>
                    <span style={{ color: "#475569", fontSize: 12 }}>No tasks</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <TaskModal task={editingTask} onSave={saveTask} onDelete={deleteTask} onClose={() => { setShowModal(false); setEditingTask(null); }} />
      )}
    </div>
  );
}

function TaskCard({ task, accent, index, onEdit, onDragStart, isDragging }) {
  const prio = PRIORITIES.find((p) => p.id === task.priority);
  return (
    <div className="card" draggable onDragStart={onDragStart} onClick={onEdit}
      style={{ ...styles.card, opacity: isDragging ? 0.4 : 1, animation: `slideIn 0.3s ${index * 0.05}s both`, borderLeft: `3px solid ${accent}33` }}>
      <div style={styles.cardTop}>
        <span style={{ ...styles.prioTag, background: prio.color + "18", color: prio.color }}>
          {prio.label}
        </span>
        <span style={styles.cardDate}>{task.createdAt}</span>
      </div>
      <h3 style={styles.cardTitle}>{task.title}</h3>
      {task.description && <p style={styles.cardDesc}>{task.description}</p>}
      {task.tags.length > 0 && (
        <div style={styles.cardTags}>
          {task.tags.map((tag) => (
            <span key={tag} className="tag" style={styles.cardTag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskModal({ task, onSave, onDelete, onClose }) {
  const isEdit = task && task.id;
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "TODO");
  const [priority, setPriority] = useState(task?.priority || "MEDIUM");
  const [tags, setTags] = useState(task?.tags || []);

  const toggleTag = (tag) => setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{isEdit ? "Edit Task" : "New Task"}</h2>
          <button style={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          <label style={styles.label}>Title</label>
          <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title..." autoFocus />
          <label style={styles.label}>Description</label>
          <textarea style={{ ...styles.input, height: 80, resize: "vertical" }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details..." />
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Status</label>
              <select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Priority</label>
              <select style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <label style={styles.label}>Tags</label>
          <div style={styles.tagGrid}>
            {TAGS.map((tag) => (
              <button key={tag} className="filter-chip" style={{ ...styles.chip, background: tags.includes(tag) ? "#6366f122" : "#0f0f18", borderColor: tags.includes(tag) ? "#6366f1" : "#1e1e2e", color: tags.includes(tag) ? "#c7d2fe" : "#64748b" }} onClick={() => toggleTag(tag)}>
                {tags.includes(tag) && "✓ "}{tag}
              </button>
            ))}
          </div>
        </div>
        <div style={styles.modalFooter}>
          {isEdit && <button style={styles.deleteBtn} onClick={() => onDelete(task.id)}>Delete</button>}
          <div style={{ flex: 1 }} />
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.saveBtn} onClick={() => title.trim() && onSave({ title, description, status, priority, tags })} disabled={!title.trim()}>
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: { fontFamily: "'DM Sans', sans-serif", background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh", padding: "20px 24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 16 },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  headerRight: { display: "flex", alignItems: "center", gap: 20 },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #1e1b4b, #312e81)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #3730a3" },
  title: { fontSize: 20, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 11, color: "#6366f1", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" },
  progressWrap: { display: "flex", alignItems: "center", gap: 10 },
  progressLabel: { fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" },
  progressBar: { width: 120, height: 4, borderRadius: 4, background: "#1e1e2e", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #6366f1, #10b981)", transition: "width 0.6s ease" },
  progressCount: { fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" },
  addBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1px solid #4f46e5", background: "linear-gradient(135deg, #4f46e5, #6366f1)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  toolbar: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  searchWrap: { display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, border: "1px solid #1e1e2e", background: "#0d0d16", flex: 1, maxWidth: 320 },
  searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
  clearBtn: { background: "none", border: "none", color: "#64748b", fontSize: 18, cursor: "pointer", lineHeight: 1 },
  filterToggle: { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid #1e1e2e", background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  filterBadge: { width: 18, height: 18, borderRadius: "50%", background: "#6366f1", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  filtersPanel: { padding: "14px 16px", borderRadius: 12, border: "1px solid #1e1e2e", background: "#0d0d16", marginBottom: 14, animation: "scaleIn 0.2s ease" },
  filterGroup: { marginBottom: 12 },
  filterLabel: { fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "block" },
  filterChips: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: { display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "1px solid #1e1e2e", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  clearFilters: { background: "none", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0 },
  board: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, overflow: "auto" },
  column: { borderRadius: 14, border: "1px solid #1a1a2e", background: "#0d0d16", minHeight: 400, display: "flex", flexDirection: "column" },
  colHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 14px 8px", borderBottom: "1px solid #13131f" },
  colTitle: { display: "flex", alignItems: "center", gap: 8 },
  colIcon: { fontSize: 14 },
  colName: { fontSize: 13, fontWeight: 600, color: "#e2e8f0" },
  colCount: { fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6, fontFamily: "'JetBrains Mono', monospace" },
  colAddBtn: { width: 24, height: 24, borderRadius: 6, border: "1px solid #1e1e2e", background: "transparent", color: "#64748b", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  colBody: { padding: 10, flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  emptyCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 },
  card: { padding: 14, borderRadius: 10, background: "#111119", border: "1px solid #1a1a2e", cursor: "grab" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  prioTag: { fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em" },
  cardDate: { fontSize: 10, color: "#475569", fontFamily: "'JetBrains Mono', monospace" },
  cardTitle: { fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 4, lineHeight: 1.4 },
  cardDesc: { fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 8 },
  cardTags: { display: "flex", flexWrap: "wrap", gap: 4 },
  cardTag: { fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "#1e1b4b", color: "#a5b4fc", fontWeight: 500 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, animation: "scaleIn 0.2s ease" },
  modal: { width: "90%", maxWidth: 500, borderRadius: 16, background: "#0d0d16", border: "1px solid #1e1e2e", overflow: "hidden" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #1a1a2e" },
  modalTitle: { fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
  modalClose: { width: 28, height: 28, borderRadius: 8, border: "1px solid #1e1e2e", background: "transparent", color: "#64748b", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  modalBody: { padding: 20, display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" },
  input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #1e1e2e", background: "#0a0a0f", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", width: "100%" },
  select: { padding: "10px 12px", borderRadius: 8, border: "1px solid #1e1e2e", background: "#0a0a0f", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", width: "100%" },
  tagGrid: { display: "flex", flexWrap: "wrap", gap: 6 },
  modalFooter: { display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderTop: "1px solid #1a1a2e" },
  deleteBtn: { padding: "8px 14px", borderRadius: 8, border: "1px solid #7f1d1d", background: "#450a0a", color: "#fca5a5", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  cancelBtn: { padding: "8px 14px", borderRadius: 8, border: "1px solid #1e1e2e", background: "transparent", color: "#94a3b8", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  saveBtn: { padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #4f46e5, #6366f1)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};
