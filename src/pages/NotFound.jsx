import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import css from "../cssModule/NotFound.module.css";
import { RiHome5Line, RiArrowLeftLine, RiSearchLine } from "react-icons/ri";

export default function NotFound() {
  const navigate   = useNavigate();
  const canvasRef  = useRef(null);

  /* ── floating particles background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 38 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 2.5 + 0.5,
      dx:   (Math.random() - 0.5) * 0.35,
      dy:   (Math.random() - 0.5) * 0.35,
      o:    Math.random() * 0.35 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(var(--particle-rgb, 100,100,100), ${p.o})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={css.page}>
      <canvas ref={canvasRef} className={css.canvas} />

      {/* ── decorative rings ── */}
      <div className={css.ring1} />
      <div className={css.ring2} />
      <div className={css.ring3} />

      <div className={css.content}>

        {/* big 404 */}
        <div className={css.heroNum}>
          <span className={css.n4a}>৪</span>
          <span className={css.zero}>
            <span className={css.zeroInner}>০</span>
          </span>
          <span className={css.n4b}>৪</span>
        </div>

        {/* divider */}
        <div className={css.divider}>
          <span className={css.dividerLine} />
          <span className={css.dividerDot} />
          <span className={css.dividerLine} />
        </div>

        {/* text */}
        <h1 className={css.title}>পাতাটি খুঁজে পাওয়া যায়নি</h1>
        <p className={css.subtitle}>
          আপনি যে পাতাটি খুঁজছেন সেটি হয়তো সরানো হয়েছে,<br />
          নাম পরিবর্তিত হয়েছে, অথবা কখনো ছিলই না।
        </p>

        {/* actions */}
        <div className={css.actions}>
          <button className={css.btnBack} onClick={() => navigate(-1)}>
            <RiArrowLeftLine />
            আগের পাতায় ফিরুন
          </button>
          <Link to="/" className={css.btnHome}>
            <RiHome5Line />
            মূল পাতায় যান
          </Link>
        </div>

        {/* search suggestion */}
        <div className={css.searchSuggest}>
          <RiSearchLine className={css.searchIcon} />
          <span>লেখা খুঁজতে চান?</span>
          <Link to="/" className={css.searchLink}>ব্লগে ফিরুন →</Link>
        </div>

      </div>
    </div>
  );
}