import { Outlet, NavLink } from "@remix-run/react";

// SIMPLIFIED DASHBOARD LAYOUT - EVERYTHING INLINE FOR CLEAR DEBUGGING
export default function DashboardLayout() {
  // Navigation items for the sidebar
  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/alerts", label: "Alerts" },
    { to: "/monitoring", label: "Monitoring" },
    { to: "/settings", label: "Settings" }
  ];

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#1e1e1e" }}>
      {/* SIDEBAR - absolute fixed position with bold styling */}
      <div style={{
        width: "256px", 
        backgroundColor: "#121212", 
        color: "white",
        position: "fixed", 
        left: 0, 
        top: 0, 
        bottom: 0,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        borderRight: "2px solid #f59e0b" // Amber color border
      }}>
        {/* LOGO */}
        <div style={{ 
          padding: "10px 0", 
          borderBottom: "1px solid #333", 
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: "bold",
          fontSize: "24px",
          color: "#f59e0b" // Amber color text
        }}>
          <div style={{ 
            backgroundColor: "#f59e0b", 
            color: "#121212", 
            width: "36px", 
            height: "36px", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            borderRadius: "8px", 
            fontWeight: "bold" 
          }}>C</div>
          Cognito
        </div>
        
        {/* NAVIGATION */}
        <nav style={{ flexGrow: 1 }}>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.to} style={{ marginBottom: "10px" }}>
                <NavLink
                  to={item.to}
                  style={({ isActive }) => ({
                    display: "block",
                    padding: "12px 16px",
                    backgroundColor: isActive ? "#333" : "transparent",
                    borderLeft: isActive ? "3px solid #f59e0b" : "none",
                    color: isActive ? "#f59e0b" : "#ccc",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontWeight: isActive ? "bold" : "normal",
                  })}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* USER PROFILE */}
        <div style={{ 
          borderTop: "1px solid #333", 
          paddingTop: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px" 
        }}>
          <div style={{ 
            backgroundColor: "#f59e0b", 
            color: "#121212", 
            width: "36px", 
            height: "36px", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            borderRadius: "50%", 
            fontWeight: "bold" 
          }}>JD</div>
          <div>
            <div style={{ fontSize: "14px" }}>John Doe</div>
            <button style={{ 
              background: "none", 
              border: "none", 
              padding: 0, 
              color: "#999",
              fontSize: "12px",
              cursor: "pointer",
              textDecoration: "underline"
            }}>Logout</button>
          </div>
        </div>
      </div>
      
      {/* MAIN CONTENT - with margin to accommodate sidebar */}
      <main style={{ 
        marginLeft: "256px", 
        flexGrow: 1, 
        padding: "30px", 
        overflowY: "auto", 
        backgroundColor: "#1e1e1e", 
        color: "white" 
      }}>
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "bold", 
          marginBottom: "20px",
          color: "#f59e0b" // Amber title
        }}>Dashboard</h1>
        
        <Outlet />
      </main>
    </div>
  );
}
