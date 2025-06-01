import React from 'react';

export default function TestSidebar() {
  return (
    <div style={{display: 'flex', height: '100vh'}}>
      <div style={{
        width: '300px', 
        backgroundColor: 'red', 
        color: 'white',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        padding: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        THIS IS A TEST SIDEBAR
      </div>
      
      <main style={{marginLeft: '300px', padding: '30px', flexGrow: 1}}>
        <h1 style={{fontSize: '32px'}}>Test Content Area</h1>
        <p style={{fontSize: '18px'}}>
          If you can see a red sidebar on the left side of this page, then we know that sidebars 
          can be properly displayed in the routing structure.
        </p>
      </main>
    </div>
  );
}
