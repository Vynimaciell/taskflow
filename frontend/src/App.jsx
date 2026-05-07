import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════
   CONSTANTS & DATA
   ═══════════════════════════════════════════ */
const COLUMNS = [
  { id: "TODO", label: "Pendência", icon: "○", accent: "#6366f1" },
  { id: "IN_PROGRESS", label: "Em andamento", icon: "◐", accent: "#f59e0b" },
  { id: "REVIEW", label: "Revisão", icon: "◑", accent: "#8b5cf6" },
  { id: "DONE", label: "Feito", icon: "●", accent: "#10b981" },
];
const PRIORITIES = [
  { id: "LOW", label: "Baixo", color: "#94a3b8" },
  { id: "MEDIUM", label: "Médio", color: "#f59e0b" },
  { id: "HIGH", label: "Alto", color: "#ef4444" },
];
const TAGS = ["Frontend", "Backend", "Bug", "Feature", "DevOps", "Design", "Testando", "Docs"];
const AVATARS = ["😎", "🧑‍💻", "👩‍💻", "🦊", "🐱", "🚀", "🎯", "⚡", "🔥", "💎", "🌟", "🎨"];
const PROJECT_ICONS = ["📁", "🏦", "🛵", "👤", "🎮", "📱", "💻", "🌐", "🎨", "📊", "🔧", "🚀"];
const PROJECT_COLORS = ["#6366f1", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

const DEMO_PROJECTS = [
  {
    id: "demo-1", name: "Tela do Santander", icon: "🏦", color: "#ef4444",
    tasks: [
      { id: 1, title: "Layout da tela de login", description: "Header, formulário e rodapé responsivo", status: "DONE", priority: "HIGH", tags: ["Frontend", "Design"], createdAt: "2026-04-28", deadline: "2026-05-05" },
      { id: 2, title: "Integração com API de autenticação", description: "Conectar formulário com endpoint /auth/login", status: "IN_PROGRESS", priority: "HIGH", tags: ["Backend", "Feature"], createdAt: "2026-04-30", deadline: "2026-05-10" },
      { id: 3, title: "Validação de CPF e senha", description: "Máscara de CPF + regras de senha forte", status: "TODO", priority: "MEDIUM", tags: ["Frontend"], createdAt: "2026-05-01", deadline: "2026-05-12" },
      { id: 4, title: "Tela de recuperar senha", description: "Fluxo de email + código + nova senha", status: "TODO", priority: "LOW", tags: ["Frontend", "Feature"], createdAt: "2026-05-02", deadline: "2026-05-20" },
      { id: 5, title: "Testes E2E do login", description: "Cypress para fluxo completo", status: "REVIEW", priority: "MEDIUM", tags: ["Testando"], createdAt: "2026-05-03", deadline: "2026-05-08" },
    ]
  },
  {
    id: "demo-2", name: "App de Delivery", icon: "🛵", color: "#10b981",
    tasks: [
      { id: 10, title: "Tela do cardápio", description: "Grid de produtos com foto, preço e botão", status: "DONE", priority: "HIGH", tags: ["Frontend"], createdAt: "2026-04-25", deadline: "2026-05-01" },
      { id: 11, title: "Carrinho de compras", description: "Adicionar, remover, alterar quantidade", status: "IN_PROGRESS", priority: "HIGH", tags: ["Frontend", "Feature"], createdAt: "2026-04-28", deadline: "2026-05-09" },
      { id: 12, title: "API de pedidos", description: "Endpoint POST /orders com validação", status: "TODO", priority: "HIGH", tags: ["Backend"], createdAt: "2026-05-01", deadline: "2026-05-15" },
      { id: 13, title: "Integração com pagamento", description: "Stripe ou MercadoPago", status: "TODO", priority: "MEDIUM", tags: ["Backend", "Feature"], createdAt: "2026-05-03", deadline: "2026-05-25" },
    ]
  },
  {
    id: "demo-3", name: "Portfolio Pessoal", icon: "👤", color: "#8b5cf6",
    tasks: [
      { id: 20, title: "Seção Hero com animação", description: "Texto animado + partículas", status: "DONE", priority: "MEDIUM", tags: ["Frontend", "Design"], createdAt: "2026-04-20", deadline: "2026-04-28" },
      { id: 21, title: "Seção de projetos", description: "Cards com preview, tags e links", status: "DONE", priority: "HIGH", tags: ["Frontend"], createdAt: "2026-04-22", deadline: "2026-04-30" },
      { id: 22, title: "Deploy na Vercel", description: "CI/CD automático com GitHub", status: "IN_PROGRESS", priority: "LOW", tags: ["DevOps"], createdAt: "2026-05-01", deadline: "2026-05-07" },
    ]
  }
];

/* ═══════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════ */
const themes = {
  dark: {
    bg: "#07070d", bgCard: "#0d0d16", bgSidebar: "#0a0a14", bgInput: "#0a0a0f", bgColumn: "#0d0d16",
    border: "#1e1e2e", borderLight: "#141420", borderColumn: "#1a1a2e",
    text: "#e2e8f0", textSecondary: "#94a3b8", textMuted: "#64748b", textDim: "#475569",
    cardBg: "#111119", accent: "#6366f1", accentLight: "#818cf8", accentBg: "#1e1b4b",
    success: "#10b981", error: "#ef4444", errorBg: "#450a0a", errorBorder: "#7f1d1d",
    tagBg: "#1e1b4b", tagText: "#a5b4fc",
  },
  light: {
    bg: "#f8fafc", bgCard: "#ffffff", bgSidebar: "#f1f5f9", bgInput: "#ffffff", bgColumn: "#f8fafc",
    border: "#e2e8f0", borderLight: "#e2e8f0", borderColumn: "#cbd5e1",
    text: "#0f172a", textSecondary: "#475569", textMuted: "#64748b", textDim: "#94a3b8",
    cardBg: "#ffffff", accent: "#4f46e5", accentLight: "#6366f1", accentBg: "#eef2ff",
    success: "#059669", error: "#dc2626", errorBg: "#fef2f2", errorBorder: "#fecaca",
    tagBg: "#eef2ff", tagText: "#4338ca",
  }
};

/* ═══════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════ */
const today = () => new Date().toISOString().slice(0, 10);
const daysUntil = (d) => { if (!d) return null; return Math.ceil((new Date(d) - new Date(today())) / 86400000); };
const deadlineColor = (d) => { const days = daysUntil(d); if (days === null) return null; if (days < 0) return "#ef4444"; if (days <= 2) return "#f59e0b"; return "#10b981"; };
const deadlineLabel = (d) => { const days = daysUntil(d); if (days === null) return ""; if (days < 0) return `${Math.abs(days)}d atrasado`; if (days === 0) return "Hoje!"; if (days === 1) return "Amanhã"; return `${days}d restantes`; };

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("demo");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [theme, setTheme] = useState("dark");
  const t = themes[theme];

  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) { setCurrentUser(user); setPage("app"); return true; }
    return false;
  };
  const handleRegister = (username, email, password, avatar) => {
    if (users.find(u => u.username === username || u.email === email)) return false;
    const newUser = { id: Date.now(), username, email, password, avatar: avatar || "😎", projects: [] };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setPage("app");
    return true;
  };
  const updateUser = (u) => { setCurrentUser(u); setUsers(prev => prev.map(x => x.id === u.id ? u : x)); };
  const handleLogout = () => { setCurrentUser(null); setPage("demo"); };
  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, color: t.text, minHeight: "100vh", transition: "background 0.3s, color 0.3s" }}>
      <style>{getGlobalCSS(t)}</style>
      {page === "demo" && <DemoPage t={t} theme={theme} toggleTheme={toggleTheme} onLogin={() => setPage("login")} onRegister={() => setPage("register")} />}
      {page === "login" && <LoginPage t={t} onLogin={handleLogin} onGoRegister={() => setPage("register")} onBack={() => setPage("demo")} />}
      {page === "register" && <RegisterPage t={t} onRegister={handleRegister} onGoLogin={() => setPage("login")} onBack={() => setPage("demo")} />}
      {page === "app" && <MainApp t={t} theme={theme} toggleTheme={toggleTheme} user={currentUser} updateUser={updateUser} onLogout={handleLogout} />}
    </div>
  );
}

/* ═══════════════════════════════════════════
   DEMO PAGE
   ═══════════════════════════════════════════ */
function DemoPage({ t, theme, toggleTheme, onLogin, onRegister }) {
  const [activeProject, setActiveProject] = useState(DEMO_PROJECTS[0]);
  const [view, setView] = useState("board");

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar t={t}>
        <SidebarHeader t={t} badge="MODO DEMO" badgeColor={t.accentLight} theme={theme} toggleTheme={toggleTheme} />
        <div style={{ padding: "12px 14px" }}>
          <div style={gs(t).sidebarLabel}>PROJETOS DE EXEMPLO</div>
          {DEMO_PROJECTS.map(p => (
            <SidebarProjectItem key={p.id} t={t} project={p} active={activeProject.id === p.id} onClick={() => setActiveProject(p)} />
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={gs(t).demoInfoBox}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.accentLight, marginBottom: 6 }}>👋 Bem-vindo ao TaskFlow!</div>
          <p style={{ fontSize: 11, color: t.textSecondary, lineHeight: 1.6, margin: 0 }}>Explore os projetos, arraste tarefas e veja o dashboard. Crie uma conta para salvar seus projetos!</p>
        </div>
        <div style={{ padding: 14 }}>
          <button className="btn-primary" style={gs(t).btnPrimary} onClick={onRegister}>Criar minha conta</button>
          <button className="btn-ghost" style={gs(t).btnGhost} onClick={onLogin}>Já tenho conta → Entrar</button>
        </div>
      </Sidebar>
      <div style={{ flex: 1, overflow: "auto" }}>
        <ViewToggle t={t} view={view} setView={setView} />
        {view === "board" ? (
          <KanbanBoard t={t} tasks={activeProject.tasks} projectName={activeProject.name} projectIcon={activeProject.icon} projectColor={activeProject.color} isDemo={true} />
        ) : (
          <Dashboard t={t} tasks={activeProject.tasks} projectName={activeProject.name} projectIcon={activeProject.icon} projectColor={activeProject.color} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AUTH PAGES
   ═══════════════════════════════════════════ */
function LoginPage({ t, onLogin, onGoRegister, onBack }) {
  const [username, setUsername] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [showPass, setShowPass] = useState(false);
  const submit = () => {
    if (!username.trim() || !password.trim()) { setError("Preencha todos os campos"); return; }
    if (!onLogin(username, password)) setError("Usuário ou senha incorretos");
  };
  return (
    <div style={gs(t).authPage}>
      <div style={gs(t).authCard}>
        <button style={gs(t).backBtn} onClick={onBack}>← Voltar ao demo</button>
        <AuthLogo t={t} />
        <h2 style={gs(t).authTitle}>Entrar na sua conta</h2>
        <p style={gs(t).authSubtitle}>Acesse seus projetos e tarefas</p>
        {error && <div style={gs(t).errorBox}>{error}</div>}
        <label style={gs(t).formLabel}>Usuário</label>
        <input style={gs(t).formInput} value={username} onChange={e => { setUsername(e.target.value); setError(""); }} placeholder="seu_usuario" autoFocus />
        <label style={gs(t).formLabel}>Senha</label>
        <div style={{ position: "relative" }}>
          <input style={gs(t).formInput} type={showPass ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} />
          <button style={gs(t).eyeBtn} onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁️"}</button>
        </div>
        <button className="btn-primary" style={{ ...gs(t).btnPrimary, marginTop: 8 }} onClick={submit}>Entrar</button>
        <p style={gs(t).authSwitch}>Não tem conta? <button style={gs(t).linkBtn} onClick={onGoRegister}>Cadastre-se</button></p>
      </div>
    </div>
  );
}

function RegisterPage({ t, onRegister, onGoLogin, onBack }) {
  const [username, setUsername] = useState(""); const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); const [confirmPass, setConfirmPass] = useState("");
  const [avatar, setAvatar] = useState("😎"); const [error, setError] = useState("");
  const submit = () => {
    if (!username.trim() || !email.trim() || !password.trim()) { setError("Preencha todos os campos"); return; }
    if (password !== confirmPass) { setError("As senhas não coincidem"); return; }
    if (password.length < 6) { setError("Senha deve ter pelo menos 6 caracteres"); return; }
    if (!onRegister(username, email, password, avatar)) setError("Usuário ou email já cadastrado");
  };
  return (
    <div style={gs(t).authPage}>
      <div style={gs(t).authCard}>
        <button style={gs(t).backBtn} onClick={onBack}>← Voltar ao demo</button>
        <AuthLogo t={t} />
        <h2 style={gs(t).authTitle}>Criar sua conta</h2>
        <p style={gs(t).authSubtitle}>Comece a organizar seus projetos</p>
        {error && <div style={gs(t).errorBox}>{error}</div>}
        <label style={gs(t).formLabel}>Avatar</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {AVATARS.map(a => (
            <button key={a} onClick={() => setAvatar(a)} style={{ width: 36, height: 36, borderRadius: 8, border: avatar === a ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: avatar === a ? t.accentBg : "transparent", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{a}</button>
          ))}
        </div>
        <label style={gs(t).formLabel}>Usuário</label>
        <input style={gs(t).formInput} value={username} onChange={e => { setUsername(e.target.value); setError(""); }} placeholder="seu_usuario" />
        <label style={gs(t).formLabel}>Email</label>
        <input style={gs(t).formInput} type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="voce@email.com" />
        <label style={gs(t).formLabel}>Senha</label>
        <input style={gs(t).formInput} type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="Mínimo 6 caracteres" />
        <label style={gs(t).formLabel}>Confirmar senha</label>
        <input style={gs(t).formInput} type="password" value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setError(""); }} placeholder="Repita a senha" onKeyDown={e => e.key === "Enter" && submit()} />
        <button className="btn-primary" style={{ ...gs(t).btnPrimary, marginTop: 8 }} onClick={submit}>Criar conta</button>
        <p style={gs(t).authSwitch}>Já tem conta? <button style={gs(t).linkBtn} onClick={onGoLogin}>Entrar</button></p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP (LOGGED IN)
   ═══════════════════════════════════════════ */
function MainApp({ t, theme, toggleTheme, user, updateUser, onLogout }) {
  const [projects, setProjects] = useState(user.projects || []);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [view, setView] = useState("board");
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => { updateUser({ ...user, projects }); }, [projects]);

  // Check deadlines for notifications
  useEffect(() => {
    const notifs = [];
    projects.forEach(p => {
      p.tasks.forEach(task => {
        if (task.deadline && task.status !== "DONE") {
          const days = daysUntil(task.deadline);
          if (days !== null && days <= 2) {
            notifs.push({ id: `${p.id}-${task.id}`, project: p.name, task: task.title, days, icon: p.icon });
          }
        }
      });
    });
    setNotifications(notifs);
  }, [projects]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const createProject = (name, icon, color) => {
    const np = { id: "proj-" + Date.now(), name, icon, color, tasks: [] };
    setProjects(prev => [...prev, np]);
    setActiveProjectId(np.id);
    setShowNewProject(false);
  };
  const deleteProject = (id) => { setProjects(prev => prev.filter(p => p.id !== id)); if (activeProjectId === id) setActiveProjectId(null); };
  const updateProjectTasks = (tasks) => { setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, tasks } : p)); };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar t={t}>
        <SidebarHeader t={t} badge="● ONLINE" badgeColor="#10b981" theme={theme} toggleTheme={toggleTheme} />
        <div style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={gs(t).sidebarLabel}>MEUS PROJETOS</div>
            <div style={{ display: "flex", gap: 4 }}>
              {/* Notification bell */}
              <div style={{ position: "relative" }}>
                <button className="btn-icon" style={gs(t).addIconBtn} onClick={() => setShowNotifs(!showNotifs)} title="Notificações">
                  🔔{notifications.length > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{notifications.length}</span>}
                </button>
                {showNotifs && (
                  <div style={{ position: "absolute", top: 32, right: 0, width: 260, background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: 10, zIndex: 100, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 8 }}>Notificações</div>
                    {notifications.length === 0 && <p style={{ fontSize: 11, color: t.textMuted }}>Nenhum prazo próximo 🎉</p>}
                    {notifications.map(n => (
                      <div key={n.id} style={{ padding: "8px 10px", borderRadius: 8, background: t.bgInput, marginBottom: 4, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 16 }}>{n.icon}</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{n.task}</div>
                          <div style={{ fontSize: 10, color: n.days < 0 ? "#ef4444" : n.days <= 1 ? "#f59e0b" : t.textMuted }}>{deadlineLabel(new Date(Date.now() + n.days * 86400000).toISOString().slice(0, 10))} — {n.project}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn-icon" style={gs(t).addIconBtn} onClick={() => setShowNewProject(true)} title="Novo projeto">+</button>
            </div>
          </div>

          {projects.length === 0 && !showNewProject && (
            <div style={{ textAlign: "center", padding: "24px 10px" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
              <p style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>Nenhum projeto ainda.</p>
              <button className="btn-primary" style={{ ...gs(t).btnPrimary, marginTop: 12, fontSize: 12, padding: "8px 16px" }} onClick={() => setShowNewProject(true)}>+ Novo Projeto</button>
            </div>
          )}

          {projects.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <SidebarProjectItem t={t} project={p} active={activeProjectId === p.id} onClick={() => setActiveProjectId(p.id)} />
              <button className="btn-icon" style={{ ...gs(t).addIconBtn, fontSize: 12, color: "#ef4444", width: 22, height: 22 }} onClick={() => deleteProject(p.id)}>✕</button>
            </div>
          ))}
          {showNewProject && <NewProjectForm t={t} onCreate={createProject} onCancel={() => setShowNewProject(false)} />}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ ...gs(t).userBox }}>
          <div style={{ fontSize: 24 }}>{user.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{user.username}</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>{user.email}</div>
          </div>
          <button className="btn-icon" style={{ ...gs(t).addIconBtn, fontSize: 11 }} onClick={onLogout} title="Sair">↪</button>
        </div>
      </Sidebar>

      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {activeProject && <ViewToggle t={t} view={view} setView={setView} />}
        {activeProject ? (
          view === "board" ? (
            <KanbanBoard t={t} tasks={activeProject.tasks} projectName={activeProject.name} projectIcon={activeProject.icon} projectColor={activeProject.color} isDemo={false} onTasksChange={updateProjectTasks} />
          ) : (
            <Dashboard t={t} tasks={activeProject.tasks} projectName={activeProject.name} projectIcon={activeProject.icon} projectColor={activeProject.color} />
          )
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
            <div style={{ fontSize: 48 }}>📋</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Selecione ou crie um projeto</h2>
            <p style={{ fontSize: 13, color: t.textMuted }}>Escolha um projeto na barra lateral</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════ */
function Sidebar({ t, children }) {
  return <div style={{ width: 260, minWidth: 260, background: t.bgSidebar, borderRight: `1px solid ${t.borderLight}`, display: "flex", flexDirection: "column", overflow: "auto", transition: "background 0.3s" }}>{children}</div>;
}
function SidebarHeader({ t, badge, badgeColor, theme, toggleTheme }) {
  return (
    <div style={{ padding: "16px 14px", borderBottom: `1px solid ${t.borderLight}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${t.accentBg}, ${t.accent}33)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.accent}44` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accentLight} strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>TaskFlow</div>
          <div style={{ fontSize: 10, color: badgeColor, fontWeight: 600, letterSpacing: "0.1em" }}>{badge}</div>
        </div>
        <button className="btn-icon" style={{ ...gs(t).addIconBtn, fontSize: 14 }} onClick={toggleTheme} title="Trocar tema">{theme === "dark" ? "☀️" : "🌙"}</button>
      </div>
    </div>
  );
}
function SidebarProjectItem({ t, project: p, active, onClick }) {
  return (
    <button className="sidebar-item" onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${active ? t.accent : "transparent"}`, background: active ? t.accentBg : "transparent", cursor: "pointer", fontFamily: "'DM Sans'", marginBottom: 2, transition: "all 0.15s", flex: 1, textAlign: "left" }}>
      <span style={{ fontSize: 18 }}>{p.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: active ? t.accentLight : t.textSecondary }}>{p.name}</div>
        <div style={{ fontSize: 11, color: t.textDim }}>{p.tasks.length} tarefas</div>
      </div>
      {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />}
    </button>
  );
}
function AuthLogo({ t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 24 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${t.accentBg}, ${t.accent}33)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.accent}44` }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.accentLight} strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: 0 }}>TaskFlow</h1>
    </div>
  );
}
function ViewToggle({ t, view, setView }) {
  return (
    <div style={{ position: "absolute", top: 14, right: 20, zIndex: 10, display: "flex", gap: 4, background: t.bgCard, borderRadius: 8, padding: 3, border: `1px solid ${t.border}` }}>
      <button className="btn-icon" onClick={() => setView("board")} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: view === "board" ? t.accentBg : "transparent", color: view === "board" ? t.accentLight : t.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>📋 Board</button>
      <button className="btn-icon" onClick={() => setView("dashboard")} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: view === "dashboard" ? t.accentBg : "transparent", color: view === "dashboard" ? t.accentLight : t.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>📊 Dashboard</button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NEW PROJECT FORM
   ═══════════════════════════════════════════ */
function NewProjectForm({ t, onCreate, onCancel }) {
  const [name, setName] = useState(""); const [icon, setIcon] = useState("📁"); const [color, setColor] = useState("#6366f1");
  return (
    <div style={{ padding: 12, borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgInput, marginTop: 8 }}>
      <input style={gs(t).formInput} value={name} onChange={e => setName(e.target.value)} placeholder="Nome do projeto..." autoFocus />
      <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, marginBottom: 4 }}>ÍCONE</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
        {PROJECT_ICONS.map(ic => <button key={ic} onClick={() => setIcon(ic)} style={{ width: 30, height: 30, borderRadius: 6, border: icon === ic ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: icon === ic ? t.accentBg : "transparent", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</button>)}
      </div>
      <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, marginBottom: 4 }}>COR</div>
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {PROJECT_COLORS.map(c => <button key={c} onClick={() => setColor(c)} style={{ width: 22, height: 22, borderRadius: "50%", border: color === c ? "2px solid #fff" : "2px solid transparent", background: c, cursor: "pointer" }} />)}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button style={{ ...gs(t).btnGhost, flex: 1, padding: 6, fontSize: 12 }} onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" style={{ ...gs(t).btnPrimary, flex: 1, padding: 6, fontSize: 12 }} onClick={() => name.trim() && onCreate(name, icon, color)} disabled={!name.trim()}>Criar</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════ */
function Dashboard({ t, tasks, projectName, projectIcon, projectColor }) {
  const total = tasks.length;
  const byStatus = COLUMNS.map(c => ({ ...c, count: tasks.filter(x => x.status === c.id).length }));
  const byPriority = PRIORITIES.map(p => ({ ...p, count: tasks.filter(x => x.priority === p.id).length }));
  const byTag = TAGS.map(tag => ({ tag, count: tasks.filter(x => x.tags?.includes(tag)).length })).filter(x => x.count > 0).sort((a, b) => b.count - a.count);
  const done = tasks.filter(x => x.status === "DONE").length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const overdue = tasks.filter(x => x.deadline && x.status !== "DONE" && daysUntil(x.deadline) < 0).length;
  const dueSoon = tasks.filter(x => x.deadline && x.status !== "DONE" && daysUntil(x.deadline) >= 0 && daysUntil(x.deadline) <= 3).length;
  const maxStatusCount = Math.max(...byStatus.map(s => s.count), 1);
  const maxTagCount = Math.max(...byTag.map(x => x.count), 1);

  return (
    <div style={{ padding: "20px 24px", paddingTop: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 28 }}>{projectIcon}</span>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: 0 }}>{projectName}</h1>
          <span style={{ fontSize: 11, color: projectColor, fontWeight: 600, letterSpacing: "0.08em" }}>DASHBOARD</span>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total", value: total, icon: "📋", color: t.accent },
          { label: "Concluídas", value: `${done} (${progress}%)`, icon: "✅", color: "#10b981" },
          { label: "Atrasadas", value: overdue, icon: "🚨", color: "#ef4444" },
          { label: "Prazo próximo", value: dueSoon, icon: "⏰", color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} style={{ padding: 18, borderRadius: 14, background: t.bgCard, border: `1px solid ${t.border}`, animation: `fadeUp 0.4s ${i * 0.1}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono'" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        {/* Status chart */}
        <div style={{ padding: 20, borderRadius: 14, background: t.bgCard, border: `1px solid ${t.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 16 }}>Por Status</h3>
          {byStatus.map(s => (
            <div key={s.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: t.textSecondary }}>{s.icon} {s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.accent, fontFamily: "'JetBrains Mono'" }}>{s.count}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: t.border, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 4, background: s.accent, width: `${(s.count / maxStatusCount) * 100}%`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Priority chart */}
        <div style={{ padding: 20, borderRadius: 14, background: t.bgCard, border: `1px solid ${t.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 16 }}>Por Prioridade</h3>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 20, height: 140, paddingTop: 10 }}>
            {byPriority.map(p => (
              <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: p.color, fontFamily: "'JetBrains Mono'" }}>{p.count}</span>
                <div style={{ width: 40, borderRadius: "6px 6px 0 0", background: p.color + "33", height: `${Math.max((p.count / total) * 100, 10)}px`, transition: "height 0.8s ease", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${(p.count / total) * 100}%`, background: p.color, borderRadius: "6px 6px 0 0", transition: "height 0.8s ease" }} />
                </div>
                <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 600 }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tags chart */}
      {byTag.length > 0 && (
        <div style={{ padding: 20, borderRadius: 14, background: t.bgCard, border: `1px solid ${t.border}`, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 16 }}>Por Tag</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {byTag.map(({ tag, count }) => (
              <div key={tag} style={{ padding: "8px 14px", borderRadius: 8, background: t.accentBg, border: `1px solid ${t.accent}33`, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: t.accentLight, fontWeight: 600 }}>{tag}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.accent, fontFamily: "'JetBrains Mono'", background: t.accent + "22", padding: "2px 6px", borderRadius: 4 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress ring */}
      <div style={{ padding: 20, borderRadius: 14, background: t.bgCard, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 24 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke={t.border} strokeWidth="8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={projectColor} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${progress * 2.51} ${251 - progress * 2.51}`} strokeDashoffset="62.75"
            style={{ transition: "stroke-dasharray 1s ease" }} />
          <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill={t.text} fontSize="20" fontWeight="700" fontFamily="'JetBrains Mono'">{progress}%</text>
        </svg>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>Progresso Geral</div>
          <div style={{ fontSize: 13, color: t.textSecondary }}>{done} de {total} tarefas concluídas</div>
          {overdue > 0 && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>⚠️ {overdue} tarefa{overdue > 1 ? "s" : ""} atrasada{overdue > 1 ? "s" : ""}</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   KANBAN BOARD
   ═══════════════════════════════════════════ */
function KanbanBoard({ t, tasks: initialTasks, projectName, projectIcon, projectColor, isDemo, onTasksChange }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [filterPriority, setFilterPriority] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const nextId = useRef(100);

  useEffect(() => { setTasks(initialTasks); }, [initialTasks]);
  useEffect(() => { if (onTasksChange) onTasksChange(tasks); }, [tasks]);

  const filteredTasks = tasks.filter(x => {
    if (filterTag && !x.tags?.includes(filterTag)) return false;
    if (filterPriority && x.priority !== filterPriority) return false;
    if (searchQuery && !x.title.toLowerCase().includes(searchQuery.toLowerCase()) && !(x.description || "").toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleDrop = colId => {
    if (draggedTask) setTasks(prev => prev.map(x => x.id === draggedTask.id ? { ...x, status: colId } : x));
    setDraggedTask(null); setDragOverCol(null);
  };
  const saveTask = td => {
    if (editingTask?.id) setTasks(prev => prev.map(x => x.id === editingTask.id ? { ...x, ...td } : x));
    else setTasks(prev => [...prev, { ...td, id: nextId.current++, createdAt: today() }]);
    setShowModal(false); setEditingTask(null);
  };
  const deleteTask = id => { setTasks(prev => prev.filter(x => x.id !== id)); setShowModal(false); setEditingTask(null); };

  const done = tasks.filter(x => x.status === "DONE").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div style={{ padding: "20px 24px", paddingTop: 50 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>{projectIcon}</span>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: 0 }}>{projectName}</h1>
            <span style={{ fontSize: 11, color: projectColor, fontWeight: 600, letterSpacing: "0.08em" }}>QUADRO KANBAN</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: t.textSecondary }}>{progress}%</span>
            <div style={{ width: 100, height: 4, borderRadius: 4, background: t.border, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${projectColor}, #10b981)`, width: `${progress}%`, transition: "width 0.6s" }} />
            </div>
            <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "'JetBrains Mono'" }}>{done}/{tasks.length}</span>
          </div>
          {!isDemo && <button className="btn-add" style={gs(t).btnAdd} onClick={() => { setEditingTask(null); setShowModal(true); }}><span style={{ fontSize: 16 }}>+</span> Nova Tarefa</button>}
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgColumn, flex: 1, maxWidth: 320 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t.text, fontSize: 13, fontFamily: "'DM Sans'" }} placeholder="Buscar tarefas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && <button style={{ background: "none", border: "none", color: t.textMuted, fontSize: 18, cursor: "pointer" }} onClick={() => setSearchQuery("")}>×</button>}
        </div>
        <button className="filter-chip" onClick={() => setShowFilters(!showFilters)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${showFilters ? t.accent : t.border}`, color: t.textSecondary, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'", background: showFilters ? t.accentBg : "transparent" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filtros
        </button>
      </div>

      {showFilters && (
        <div style={{ padding: 14, borderRadius: 12, border: `1px solid ${t.border}`, background: t.bgColumn, marginBottom: 14 }}>
          <div style={{ marginBottom: 10 }}>
            <span style={gs(t).sidebarLabel}>PRIORIDADE</span>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {PRIORITIES.map(p => (
                <button key={p.id} className="filter-chip" onClick={() => setFilterPriority(filterPriority === p.id ? null : p.id)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: `1px solid ${filterPriority === p.id ? p.color : t.border}`, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'", background: filterPriority === p.id ? p.color + "22" : t.bgInput, color: filterPriority === p.id ? p.color : t.textSecondary }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} /> {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span style={gs(t).sidebarLabel}>TAG</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {TAGS.map(tag => (
                <button key={tag} className="filter-chip" onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                  style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${filterTag === tag ? t.accent : t.border}`, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'", background: filterTag === tag ? t.accentBg : t.bgInput, color: filterTag === tag ? t.accentLight : t.textSecondary }}>{tag}</button>
              ))}
            </div>
          </div>
          {(filterTag || filterPriority) && <button style={{ background: "none", border: "none", color: t.accent, fontSize: 12, cursor: "pointer", marginTop: 10, fontFamily: "'DM Sans'" }} onClick={() => { setFilterTag(null); setFilterPriority(null); }}>Limpar filtros</button>}
        </div>
      )}

      {isDemo && (
        <div style={{ padding: "10px 14px", borderRadius: 10, background: t.accentBg + "44", border: `1px solid ${t.accent}33`, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span style={{ fontSize: 12, color: t.accentLight }}>Modo demo — arraste os cards entre colunas. Crie uma conta para salvar!</span>
        </div>
      )}

      {/* Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(x => x.status === col.id);
          const isOver = dragOverCol === col.id;
          return (
            <div key={col.id} className="col-drop" style={{ borderRadius: 14, border: `1px solid ${isOver ? col.accent + "66" : t.borderColumn}`, background: isOver ? col.accent + "08" : t.bgColumn, minHeight: 350, display: "flex", flexDirection: "column", transition: "all 0.3s" }}
              onDragOver={e => { e.preventDefault(); setDragOverCol(col.id); }} onDragLeave={() => setDragOverCol(null)} onDrop={() => handleDrop(col.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 14px 8px", borderBottom: `1px solid ${t.border}22` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: col.accent, fontSize: 14 }}>{col.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{col.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: col.accent + "18", color: col.accent, fontFamily: "'JetBrains Mono'" }}>{colTasks.length}</span>
                </div>
                {!isDemo && <button style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans'" }} onClick={() => { setEditingTask({ status: col.id }); setShowModal(true); }}>+</button>}
              </div>
              <div style={{ padding: 10, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {colTasks.map((task, i) => <TaskCard key={task.id} t={t} task={task} accent={col.accent} index={i} onEdit={() => { if (!isDemo) { setEditingTask(task); setShowModal(true); } }} onDragStart={() => setDraggedTask(task)} isDragging={draggedTask?.id === task.id} />)}
                {colTasks.length === 0 && <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}><span style={{ fontSize: 24, opacity: 0.3 }}>{col.icon}</span><span style={{ color: t.textDim, fontSize: 12 }}>Sem tarefas</span></div>}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && <TaskModal t={t} task={editingTask} onSave={saveTask} onDelete={deleteTask} onClose={() => { setShowModal(false); setEditingTask(null); }} />}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TASK CARD
   ═══════════════════════════════════════════ */
function TaskCard({ t, task, accent, index, onEdit, onDragStart, isDragging }) {
  const prio = PRIORITIES.find(p => p.id === task.priority) || PRIORITIES[1];
  const dlColor = deadlineColor(task.deadline);
  return (
    <div className="card" draggable onDragStart={onDragStart} onClick={onEdit}
      style={{ padding: 14, borderRadius: 10, background: t.cardBg, border: `1px solid ${t.borderColumn}`, borderLeft: `3px solid ${accent}44`, cursor: "grab", opacity: isDragging ? 0.4 : 1, animation: `slideIn 0.3s ${index * 0.05}s both`, transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: prio.color + "18", color: prio.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{prio.label}</span>
        <span style={{ fontSize: 10, color: t.textDim, fontFamily: "'JetBrains Mono'" }}>{task.createdAt}</span>
      </div>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 4, lineHeight: 1.4 }}>{task.title}</h3>
      {task.description && <p style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5, marginBottom: 8 }}>{task.description}</p>}
      {task.deadline && task.status !== "DONE" && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8, fontSize: 10, color: dlColor, fontWeight: 600 }}>
          <span>⏰</span> {deadlineLabel(task.deadline)}
        </div>
      )}
      {task.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {task.tags.map(tag => <span key={tag} className="tag" style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: t.tagBg, color: t.tagText, fontWeight: 500 }}>{tag}</span>)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TASK MODAL
   ═══════════════════════════════════════════ */
function TaskModal({ t, task, onSave, onDelete, onClose }) {
  const isEdit = task && task.id;
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "TODO");
  const [priority, setPriority] = useState(task?.priority || "MEDIUM");
  const [tags, setTags] = useState(task?.tags || []);
  const [deadline, setDeadline] = useState(task?.deadline || "");
  const toggleTag = tag => setTags(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
      <div style={{ width: "90%", maxWidth: 500, borderRadius: 16, background: t.bgCard, border: `1px solid ${t.border}`, overflow: "hidden", animation: "scaleIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{isEdit ? "Editar Tarefa" : "Nova Tarefa"}</h2>
          <button style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>×</button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={gs(t).formLabel}>Título</label>
          <input style={gs(t).formInput} value={title} onChange={e => setTitle(e.target.value)} placeholder="Nome da tarefa..." autoFocus />
          <label style={gs(t).formLabel}>Descrição</label>
          <textarea style={{ ...gs(t).formInput, height: 70, resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes..." />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><label style={gs(t).formLabel}>Status</label><select style={gs(t).formSelect} value={status} onChange={e => setStatus(e.target.value)}>{COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
            <div style={{ flex: 1 }}><label style={gs(t).formLabel}>Prioridade</label><select style={gs(t).formSelect} value={priority} onChange={e => setPriority(e.target.value)}>{PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div>
          </div>
          <label style={gs(t).formLabel}>Prazo</label>
          <input style={gs(t).formInput} type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          <label style={gs(t).formLabel}>Tags</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TAGS.map(tag => (
              <button key={tag} className="filter-chip" onClick={() => toggleTag(tag)}
                style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${tags.includes(tag) ? t.accent : t.border}`, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'", background: tags.includes(tag) ? t.accentBg : t.bgInput, color: tags.includes(tag) ? t.accentLight : t.textMuted }}>
                {tags.includes(tag) && "✓ "}{tag}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderTop: `1px solid ${t.border}` }}>
          {isEdit && <button style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${t.errorBorder}`, background: t.errorBg, color: "#fca5a5", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }} onClick={() => onDelete(task.id)}>Excluir</button>}
          <div style={{ flex: 1 }} />
          <button style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'" }} onClick={onClose}>Cancelar</button>
          <button className="btn-primary" style={{ ...gs(t).btnPrimary, padding: "8px 18px", fontSize: 13, width: "auto" }} onClick={() => title.trim() && onSave({ title, description, status, priority, tags, deadline })} disabled={!title.trim()}>{isEdit ? "Atualizar" : "Criar"}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DYNAMIC STYLES
   ═══════════════════════════════════════════ */
const gs = (t) => ({
  sidebarLabel: { fontSize: 10, color: t.textDim, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 },
  addIconBtn: { width: 24, height: 24, borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans'", position: "relative" },
  demoInfoBox: { margin: "0 14px", padding: 14, borderRadius: 10, background: t.accentBg + "66", border: `1px solid ${t.accent}33` },
  btnPrimary: { width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${t.accent}`, background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", marginBottom: 6 },
  btnGhost: { width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'" },
  btnAdd: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: `1px solid ${t.accent}`, background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" },
  userBox: { padding: "12px 14px", borderTop: `1px solid ${t.borderLight}`, display: "flex", alignItems: "center", gap: 10 },
  authPage: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 50% 0%, ${t.accentBg}55, transparent 60%), ${t.bg}`, padding: 20 },
  authCard: { width: "100%", maxWidth: 420, padding: 32, borderRadius: 20, background: t.bgCard, border: `1px solid ${t.border}`, animation: "scaleIn 0.3s ease" },
  authTitle: { fontSize: 18, fontWeight: 700, color: t.text, textAlign: "center", margin: "0 0 4px" },
  authSubtitle: { fontSize: 13, color: t.textMuted, textAlign: "center", margin: "0 0 20px" },
  backBtn: { background: "none", border: "none", color: t.accent, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'", padding: 0, marginBottom: 20 },
  formLabel: { fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, display: "block" },
  formInput: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: 13, outline: "none", fontFamily: "'DM Sans'", marginBottom: 12 },
  formSelect: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: 13, outline: "none", fontFamily: "'DM Sans'" },
  eyeBtn: { position: "absolute", right: 10, top: "50%", transform: "translateY(-70%)", background: "none", border: "none", cursor: "pointer", fontSize: 14 },
  errorBox: { padding: "10px 14px", borderRadius: 8, background: t.errorBg, border: `1px solid ${t.errorBorder}`, color: "#fca5a5", fontSize: 12, marginBottom: 12 },
  authSwitch: { fontSize: 13, color: t.textMuted, textAlign: "center", margin: "16px 0 0" },
  linkBtn: { background: "none", border: "none", color: t.accentLight, cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans'", fontSize: 13 },
});

const getGlobalCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${t.bg}; transition: background 0.3s; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 10px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  .card { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important; }
  .sidebar-item:hover { background: ${t.bgCard} !important; }
  .btn-primary:hover { box-shadow: 0 0 24px ${t.accent}44; transform: translateY(-1px); }
  .btn-primary { transition: all 0.2s ease; }
  .btn-ghost:hover { border-color: ${t.accent} !important; color: ${t.accentLight} !important; }
  .btn-ghost { transition: all 0.2s ease; }
  .btn-add:hover { box-shadow: 0 0 20px ${t.accent}55; transform: scale(1.03); }
  .btn-add { transition: all 0.2s ease; }
  .btn-icon:hover { background: ${t.accentBg} !important; color: ${t.accentLight} !important; }
  .btn-icon { transition: all 0.15s ease; }
  .filter-chip { transition: all 0.15s ease; }
  .filter-chip:hover { opacity: 0.85; }
  .tag { transition: all 0.15s ease; }
  .tag:hover { transform: scale(1.05); }
  .col-drop { transition: all 0.3s ease; }
`;
