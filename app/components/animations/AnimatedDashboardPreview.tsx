import { motion, useAnimationControls } from 'framer-motion';
import React, { useState, useEffect } from 'react';

const AnimatedDashboardPreview: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const lineChartControls = useAnimationControls();
  const barChartControls = useAnimationControls();
  
  // Simulated data points
  const lineData = [20, 38, 28, 42, 25, 35, 50, 42, 48, 30, 55, 60];
  const barData = [35, 65, 40, 70, 50, 60];
  
  // Mock alerts and metrics data
  const alerts = [
    { id: 1, severity: 'high', title: 'Unusual traffic spike detected', time: '2m ago' },
    { id: 2, severity: 'medium', title: 'New data breach reported', time: '10m ago' },
    { id: 3, severity: 'low', title: 'API response time increased', time: '25m ago' },
  ];
  
  const metrics = [
    { id: 1, label: 'Risk Score', value: '72', trend: 'up', color: 'text-red-500' },
    { id: 2, label: 'Threats', value: '18', trend: 'up', color: 'text-amber-500' },
    { id: 3, label: 'Mentions', value: '342', trend: 'down', color: 'text-green-500' },
  ];

  // Run animation sequences
  useEffect(() => {
    const animateCharts = async () => {
      // Animate the line chart drawing
      await lineChartControls.start({
        pathLength: 1,
        transition: { duration: 1.5, ease: 'easeInOut' }
      });
      
      // Then animate the bar chart
      await barChartControls.start(i => ({
        scaleY: 1,
        opacity: 1,
        transition: { duration: 0.4, delay: i * 0.1 }
      }));
    };
    
    animateCharts();
  }, [lineChartControls, barChartControls]);

  // Generate points for line chart SVG path
  const generateLinePath = () => {
    const width = 240;
    const height = 100;
    const padding = 10;
    const availableWidth = width - (padding * 2);
    const availableHeight = height - (padding * 2);
    
    // Map data points to SVG coordinates
    const points = lineData.map((point, i) => {
      const x = padding + (i * (availableWidth / (lineData.length - 1)));
      const y = height - padding - ((point / 60) * availableHeight);
      return `${x},${y}`;
    }).join(' ');
    
    return `M ${points}`;
  };

  return (
    <motion.div 
      className="relative w-full h-full bg-[#1D1D1D] p-4 rounded-lg shadow-2xl overflow-hidden border border-amber/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ boxShadow: '0 0 15px 5px rgba(255,191,0,0.15)' }}
    >
      {/* Dashboard Header */}
      <motion.div 
        className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center">
          <motion.div 
            className="w-8 h-8 rounded-md bg-amber/80 mr-2 flex items-center justify-center text-charcoal font-bold"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 191, 0, 1)' }}
          >
            C
          </motion.div>
          <h3 className="text-sm font-semibold text-offwhite">Cognito Intelligence Dashboard</h3>
        </div>
        
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </motion.div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-12 gap-3 h-[calc(100%-40px)]">
        {/* Main Content Area - 8 columns */}
        <div className="col-span-8 space-y-3">
          {/* Main Chart */}
          <motion.div 
            className="bg-[#252525] rounded-md p-3 h-40 border border-gray-700/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -2, boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs text-silver">Risk Exposure Trend</h4>
              <motion.div 
                className="text-xs px-2 py-1 bg-amber/10 text-amber rounded"
                whileHover={{ backgroundColor: 'rgba(255,191,0,0.2)' }}
              >
                Last 12 Weeks
              </motion.div>
            </div>
            
            <svg width="100%" height="100" className="mt-2">
              {/* Chart Grid Lines */}
              <line x1="0" y1="0" x2="0" y2="100" stroke="rgba(107,114,128,0.1)" />
              <line x1="0" y1="25" x2="100%" y2="25" stroke="rgba(107,114,128,0.1)" />
              <line x1="0" y1="50" x2="100%" y2="50" stroke="rgba(107,114,128,0.1)" />
              <line x1="0" y1="75" x2="100%" y2="75" stroke="rgba(107,114,128,0.1)" />
              
              {/* Animated Line */}
              <motion.path
                d={generateLinePath()}
                fill="none"
                stroke="#FFBF00"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={lineChartControls}
              />
              
              {/* Data Points */}
              {lineData.map((point, i) => {
                const x = 10 + (i * (220 / (lineData.length - 1)));
                const y = 100 - 10 - ((point / 60) * 80);
                return (
                  <motion.circle 
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#FFBF00"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      r: isHovered && lineData[i] > 45 ? 5 : 3
                    }}
                    transition={{ 
                      delay: 1.5 + (i * 0.05),
                      duration: 0.3
                    }}
                  />
                );
              })}
            </svg>
          </motion.div>
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-3">
            {metrics.map((metric, i) => (
              <motion.div 
                key={metric.id}
                className="bg-[#252525] rounded-md p-3 border border-gray-700/50 flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + (i * 0.1) }}
                whileHover={{ y: -2, boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
              >
                <div className="text-xs text-silver mb-1">{metric.label}</div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-offwhite mr-2">{metric.value}</span>
                  <motion.span 
                    className={`text-xs ${metric.color} flex items-center`}
                    animate={{
                      y: isHovered ? [-1, 1, -1] : 0
                    }}
                    transition={{ 
                      repeat: isHovered ? Infinity : 0, 
                      duration: 0.6 
                    }}
                  >
                    {metric.trend === 'up' ? '↑' : '↓'} 
                    {metric.trend === 'up' ? '+12%' : '-8%'}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Bar Chart */}
          <motion.div 
            className="bg-[#252525] rounded-md p-3 h-32 border border-gray-700/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ y: -2, boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs text-silver">Threat Categories</h4>
              <motion.div 
                className="text-xs px-2 py-1 bg-amber/10 text-amber rounded"
                whileHover={{ backgroundColor: 'rgba(255,191,0,0.2)' }}
              >
                This Month
              </motion.div>
            </div>
            
            <div className="flex items-end justify-between h-16 mt-1">
              {barData.map((value, i) => (
                <motion.div 
                  key={i}
                  className="w-8 bg-amber/80 rounded-t"
                  style={{ height: `${value}%` }}
                  initial={{ scaleY: 0, opacity: 0.5 }}
                  custom={i}
                  animate={barChartControls}
                  whileHover={{ backgroundColor: 'rgba(255,191,0,1)' }}
                />
              ))}
            </div>
            
            <div className="flex justify-between mt-1">
              {['Data', 'Web', 'Cloud', 'Supply', 'Social', 'Device'].map((label, i) => (
                <div key={i} className="text-[10px] text-silver/70 w-8 text-center">{label}</div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Sidebar - 4 columns */}
        <div className="col-span-4 space-y-3">
          {/* Alert Section */}
          <motion.div 
            className="bg-[#252525] rounded-md p-3 border border-gray-700/50 h-[calc(100%-3.75rem)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ x: -2, boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs text-silver">Critical Alerts</h4>
              <motion.div 
                className="flex items-center text-xs text-amber"
                whileHover={{ scale: 1.05 }}
              >
                <span className="w-2 h-2 rounded-full bg-amber animate-pulse mr-1"></span>
                Live
              </motion.div>
            </div>
            
            <div className="space-y-2 overflow-hidden">
              {alerts.map((alert, i) => (
                <motion.div 
                  key={alert.id} 
                  className="p-2 rounded border border-gray-700/30 bg-gray-800/30 text-xs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.8 + (i * 0.15),
                    duration: 0.4 
                  }}
                  whileHover={{ 
                    backgroundColor: 'rgba(40,40,40,0.8)', 
                    borderColor: 'rgba(255,191,0,0.2)' 
                  }}
                >
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span 
                        className={`w-2 h-2 rounded-full mr-1 ${alert.severity === 'high' ? 'bg-red-500' : 
                        alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}
                      ></span>
                      <span className="text-offwhite">{alert.title}</span>
                    </div>
                    <span className="text-gray-400 text-[10px]">{alert.time}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 ml-3">
                    {alert.severity === 'high' ? 'Immediate attention required' : 
                     alert.severity === 'medium' ? 'Monitor closely' : 'For information'}
                  </div>
                </motion.div>
              ))}

              <motion.div 
                className="text-center text-[10px] text-amber/80 mt-4 py-1 cursor-pointer"
                whileHover={{ scale: 1.05, color: 'rgba(255,191,0,1)' }}
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
              >
                View All Alerts
              </motion.div>
            </div>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div 
            className="bg-amber/10 rounded-md p-2 border border-amber/20 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            whileHover={{ backgroundColor: 'rgba(255,191,0,0.15)' }}
          >
            <motion.button 
              className="text-amber text-xs font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Intelligence Report
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Overlay glow effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-amber/0 to-amber/5 pointer-events-none"
        animate={{
          opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2
        }}
        transition={{
          repeat: isHovered ? Infinity : 0,
          duration: 2
        }}
      />
    </motion.div>
  );
};

export default AnimatedDashboardPreview;
