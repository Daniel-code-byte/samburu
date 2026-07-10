import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [slides, setSlides] = useState([]);
  const [news, setNews] = useState([]);
  const [current, setCurrent] = useState(0);
  const canvasRef = useRef(null);

  // ----- FETCH DATA (your existing logic) -----
  useEffect(() => {
    async function fetchData() {
      const { data: photos } = await supabase
        .from('photos')
        .select('*');
      if (photos) setSlides(photos);

      const { data: articles } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (articles) setNews(articles);
    }
    fetchData();
  }, []);

  // ----- ACACIA TREE ANIMATION (Canvas) -----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // ----- ACACIA TREE PARAMETERS -----
    const tree = {
      x: canvas.width * 0.5,
      y: canvas.height * 0.75,
      trunkHeight: canvas.height * 0.25,
      trunkWidth: 14,
      branches: [],
      leaves: [],
    };

    // Generate branches (acacia-like flat top)
    const generateBranches = () => {
      const branches = [];
      const levels = 6;
      const baseAngle = -Math.PI / 2;
      const spread = 1.2;

      for (let i = 0; i < levels; i++) {
        const t = i / levels;
        const yPos = tree.y - tree.trunkHeight * (0.3 + t * 0.6);
        const widthScale = 1 - t * 0.5;
        const branchCount = Math.floor(3 + t * 4);

        for (let j = 0; j < branchCount; j++) {
          const angleOffset = (j / branchCount) * Math.PI * 2;
          const angle = baseAngle + angleOffset * spread;
          const length = (40 + Math.random() * 80) * (1 - t * 0.3);
          const thickness = (6 - t * 3) * widthScale;

          branches.push({
            x: tree.x + Math.cos(angleOffset * 0.7) * 20 * t,
            y: yPos,
            angle: angle + (Math.random() - 0.5) * 0.3,
            length: length,
            thickness: Math.max(thickness, 1.5),
            phase: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.01,
          });
        }
      }
      return branches;
    };

    // Generate leaf clusters
    const generateLeaves = () => {
      const leaves = [];
      for (let i = 0; i < 180; i++) {
        const t = Math.random();
        const yPos = tree.y - tree.trunkHeight * (0.2 + t * 0.7);
        const spread = 80 + Math.random() * 160;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * spread * (0.3 + t * 0.5);

        leaves.push({
          x: tree.x + Math.cos(angle) * dist,
          y: yPos - Math.random() * 20,
          size: 6 + Math.random() * 14,
          sway: Math.random() * 0.02,
          phase: Math.random() * Math.PI * 2,
          color: `hsl(${100 + Math.random() * 30}, ${40 + Math.random() * 30}%, ${35 + Math.random() * 25}%)`,
        });
      }
      return leaves;
    };

    tree.branches = generateBranches();
    tree.leaves = generateLeaves();

    // Animation loop
    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ----- BACKGROUND: sunset/savanna gradient -----
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#1a2a1f');
      grad.addColorStop(0.3, '#2d4a33');
      grad.addColorStop(0.6, '#5d6b4a');
      grad.addColorStop(0.8, '#8a7a5a');
      grad.addColorStop(1, '#3d2e1e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ----- SUN / MOON glow -----
      const sunX = canvas.width * 0.8;
      const sunY = canvas.height * 0.15;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 200);
      sunGrad.addColorStop(0, 'rgba(255, 220, 150, 0.4)');
      sunGrad.addColorStop(0.5, 'rgba(255, 180, 100, 0.15)');
      sunGrad.addColorStop(1, 'rgba(255, 150, 50, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ----- DRAW BRANCHES (with sway) -----
      tree.branches.forEach((branch) => {
        const sway = Math.sin(frame * branch.speed + branch.phase) * 3;
        const angle = branch.angle + sway * 0.015;

        ctx.beginPath();
        ctx.moveTo(branch.x, branch.y);
        const endX = branch.x + Math.cos(angle) * branch.length;
        const endY = branch.y + Math.sin(angle) * branch.length;
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#3d2b1a';
        ctx.lineWidth = branch.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Small sub-branches (twigs)
        if (branch.length > 40) {
          for (let k = 0; k < 3; k++) {
            const subAngle = angle + (k - 1) * 0.7 + sway * 0.01;
            const subLen = branch.length * (0.25 + Math.random() * 0.2);
            const subX = branch.x + Math.cos(angle) * branch.length * 0.5;
            const subY = branch.y + Math.sin(angle) * branch.length * 0.5;
            ctx.beginPath();
            ctx.moveTo(subX, subY);
            ctx.lineTo(
              subX + Math.cos(subAngle) * subLen,
              subY + Math.sin(subAngle) * subLen
            );
            ctx.strokeStyle = '#4a3520';
            ctx.lineWidth = branch.thickness * 0.3;
            ctx.stroke();
          }
        }
      });

      // ----- DRAW LEAVES (with gentle sway) -----
      tree.leaves.forEach((leaf) => {
        const swayX = Math.sin(frame * 0.008 + leaf.phase) * leaf.sway * 15;
        const swayY = Math.cos(frame * 0.006 + leaf.phase * 1.3) * leaf.sway * 8;

        ctx.beginPath();
        ctx.ellipse(
          leaf.x + swayX,
          leaf.y + swayY,
          leaf.size * 0.5,
          leaf.size * 0.3,
          Math.sin(frame * 0.005 + leaf.phase) * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = leaf.color;
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Small highlight
        ctx.beginPath();
        ctx.ellipse(
          leaf.x + swayX - 2,
          leaf.y + swayY - 3,
          leaf.size * 0.15,
          leaf.size * 0.1,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255,255,200,0.15)';
        ctx.fill();
      });

      // ----- TRUNK (with roots) -----
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(tree.x - tree.trunkWidth * 0.4, tree.y);
      ctx.lineTo(tree.x - tree.trunkWidth * 0.2, tree.y - tree.trunkHeight);
      ctx.lineTo(tree.x + tree.trunkWidth * 0.2, tree.y - tree.trunkHeight);
      ctx.lineTo(tree.x + tree.trunkWidth * 0.4, tree.y);
      ctx.closePath();
      ctx.fillStyle = '#2d1f12';
      ctx.fill();

      // Ground line
      ctx.beginPath();
      ctx.ellipse(tree.x, tree.y + 8, 120, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(30, 25, 15, 0.3)';
      ctx.fill();

      // Small grass tufts
      for (let i = 0; i < 20; i++) {
        const gx = tree.x + (Math.random() - 0.5) * 300;
        const gy = tree.y + 4 + Math.random() * 6;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + (Math.random() - 0.5) * 8, gy - 8 - Math.random() * 12);
        ctx.strokeStyle = `rgba(60, 80, 40, ${0.2 + Math.random() * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ----- RENDER -----
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0e1c22' }}>
      {/* Canvas for acacia tree */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* OVERLAY CONTENT */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f2eee7',
          textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          padding: '1.5rem',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Main heading */}
        <h1
          style={{
            fontSize: 'clamp(2.8rem, 14vw, 6rem)',
            fontWeight: 700,
            letterSpacing: '4px',
            marginBottom: '0.3rem',
            background: 'linear-gradient(135deg, #f7e9c3, #d4b68a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Under Maintenance
        </h1>

        {/* Sub message */}
        <p
          style={{
            fontSize: 'clamp(1.2rem, 4vw, 2.2rem)',
            fontWeight: 300,
            letterSpacing: '2px',
            marginBottom: '0.5rem',
            color: '#e5dccf',
          }}
        >
          We'll be back soon ✦
        </p>

        {/* Decorative icons */}
        <div
          style={{
            fontSize: '2.2rem',
            margin: '0.5rem 0 1rem',
            color: '#c9b393',
            letterSpacing: '12px',
          }}
        >
          <i className="fas fa-tree" style={{ marginRight: '8px' }} />
          <i className="fas fa-sun" style={{ marginRight: '8px' }} />
          <i className="fas fa-cloud" />
        </div>

        {/* Branding: getkelhonic.com */}
        <div
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
            fontWeight: 300,
            background: 'rgba(20, 35, 30, 0.5)',
            backdropFilter: 'blur(4px)',
            padding: '0.6rem 2.2rem',
            borderRadius: '60px',
            border: '1px solid rgba(255, 215, 150, 0.25)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
            color: '#ede3d4',
            marginTop: '1rem',
            display: 'inline-block',
            pointerEvents: 'auto',
          }}
        >
          <i className="fas fa-globe-africa" style={{ marginRight: '10px', color: '#dbbc96' }} />
          managed by <span style={{ fontWeight: 600, color: '#f5e3c1' }}>getkelhonic.com</span>
        </div>

        {/* Small status note */}
        <p
          style={{
            marginTop: '1.8rem',
            fontSize: '0.9rem',
            color: '#8f9a8a',
            letterSpacing: '2px',
            opacity: 0.6,
          }}
        >
          <i className="fas fa-code" style={{ marginRight: '6px' }} />
          we are down for a moment
        </p>
      </div>

      {/* Tiny acacia tag (bottom right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '30px',
          zIndex: 20,
          color: '#6f7e72',
          fontSize: '0.75rem',
          letterSpacing: '2px',
          opacity: 0.4,
          background: 'rgba(0,0,0,0.2)',
          padding: '4px 16px',
          borderRadius: '30px',
          backdropFilter: 'blur(2px)',
          border: '1px solid #3d4d44',
          pointerEvents: 'none',
        }}
      >
        <i className="fas fa-seedling" style={{ marginRight: '6px' }} />
        acacia · savanna
      </div>
    </div>
  );
}
