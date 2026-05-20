import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { ArrowRight, ClipboardList, LayoutDashboard, Users, CalendarCheck, Trophy, Medal } from "lucide-react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@500&display=swap');
:root{--s:#0F172A;--b:#2B5BDB;--bl:#4B79F5;--t:#00C9A7;--m:#64748B;--ml:#94A3B8;--r:rgba(255,255,255,.07);--rs:rgba(255,255,255,.12);--bd:#D8DCE8;--g:linear-gradient(135deg,#2B5BDB 0%,#00C9A7 100%);--fd:'Playfair Display',Georgia,serif;--fb:'DM Sans',system-ui,sans-serif;--fm:'DM Mono',monospace}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scrollbar-gutter:stable}
body{font-family:var(--fb);background:#F4F6FA;color:#1E293B;-webkit-font-smoothing:antialiased}
.gt{background:var(--g);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nav{position:sticky;top:0;z-index:100;background:var(--s);border-bottom:1px solid var(--rs);backdrop-filter:blur(12px)}
.navi{max-width:1280px;margin:0 auto;padding:0 2rem;height:64px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:12px}
.logo{width:36px;height:36px;border-radius:6px;overflow:hidden;flex-shrink:0}
.btext{font-family:var(--fb);font-weight:600;font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:#fff}
.divd{width:1px;height:20px;background:var(--rs);margin:0 4px;flex-shrink:0}
.acts{display:flex;align-items:center;gap:8px}
.gh,.gp{display:inline-flex;align-items:center;gap:6px;font-family:var(--fb);border-radius:6px;text-decoration:none;cursor:pointer;transition:color .2s,background-color .2s,transform .15s,box-shadow .2s}
.gh{background:none;border:none;font-size:13.5px;font-weight:500;color:var(--ml);padding:8px 14px}
.gh:hover{color:#fff;background:rgba(255,255,255,.06)}
.gp{background:var(--b);border:none;font-size:13.5px;font-weight:600;color:#fff;padding:9px 20px;letter-spacing:.04em}
.gp:hover{background:var(--bl);transform:translateY(-1px);box-shadow:0 4px 20px rgba(43,91,219,.35)}
.hero{background:var(--s);position:relative;overflow:hidden}
.hgrid{position:absolute;inset:0;background-image:linear-gradient(var(--r) 1px,transparent 1px),linear-gradient(90deg,var(--r) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.4) 30%,rgba(0,0,0,.4) 70%,transparent 100%);pointer-events:none}
.gl,.gr{position:absolute;border-radius:50%;pointer-events:none}
.gl{top:-120px;left:-80px;width:520px;height:520px;background:radial-gradient(circle,rgba(43,91,219,.14) 0%,transparent 70%)}
.gr{bottom:-80px;right:10%;width:400px;height:400px;background:radial-gradient(circle,rgba(0,201,167,.1) 0%,transparent 70%)}
.hi{position:relative;z-index:2;max-width:1280px;margin:0 auto;padding:5rem 2rem 6rem;display:grid;grid-template-columns:1fr 360px;gap:4rem;align-items:center}
@media(max-width:900px){.hi{grid-template-columns:1fr;gap:3rem}.aside{display:none}}
.eb{display:inline-flex;align-items:center;gap:8px;font-family:var(--fm);font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--t);margin-bottom:1.75rem;padding:5px 12px 5px 8px;border:1px solid rgba(0,201,167,.25);border-radius:4px;background:rgba(0,201,167,.06);width:fit-content}
.ebd{width:6px;height:6px;border-radius:50%;background:var(--t);flex-shrink:0}
.h1{font-family:var(--fd);font-size:clamp(40px,5.5vw,66px);font-weight:700;line-height:1.05;letter-spacing:-.02em;color:#fff;margin-bottom:1.5rem}
.sub{font-size:16px;font-weight:300;line-height:1.75;color:var(--ml);max-width:520px;margin-bottom:2.5rem;letter-spacing:.01em}
.ctas{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.cp{display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:var(--b);color:#fff;font-family:var(--fb);font-size:14px;font-weight:600;letter-spacing:.04em;border:none;border-radius:7px;cursor:pointer;text-decoration:none;transition:background-color .2s,transform .15s,box-shadow .2s}
.cp:hover{background:var(--bl);transform:translateY(-2px);box-shadow:0 8px 28px rgba(43,91,219,.38)}
.cs{font-size:13px;font-weight:500;color:var(--ml);letter-spacing:.02em;display:inline-flex;align-items:center;gap:6px}
.cs::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--t);display:inline-block}
/* LEADERBOARD WIDGET */
.aside{display:flex;flex-direction:column;gap:0;background:rgba(255,255,255,.04);border:1px solid var(--rs);border-radius:12px;overflow:hidden}
.lb-head{padding:14px 18px;border-bottom:1px solid var(--r);display:flex;align-items:center;justify-content:space-between}
.lb-title{font-family:var(--fm);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ml)}
.lb-badge{font-family:var(--fm);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--t);border:1px solid rgba(0,201,167,.3);padding:3px 8px;border-radius:3px}
.lb-row{display:flex;align-items:center;gap:12px;padding:11px 18px;border-bottom:1px solid var(--r);transition:background .15s}
.lb-row:last-child{border-bottom:none}
.lb-row:hover{background:rgba(255,255,255,.04)}
.lb-row.top{background:rgba(43,91,219,.08)}
.lb-rank{font-family:var(--fm);font-size:11px;color:var(--m);width:18px;text-align:center;flex-shrink:0}
.lb-rank.gold{color:#F59E0B}
.lb-avatar{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;text-transform:uppercase}
.av1{background:rgba(43,91,219,.25);color:#93BBFF}
.av2{background:rgba(0,201,167,.2);color:#5EEAD4}
.av3{background:rgba(245,158,11,.2);color:#FCD34D}
.av4{background:rgba(168,85,247,.2);color:#D8B4FE}
.av5{background:rgba(239,68,68,.2);color:#FCA5A5}
.lb-name{flex:1;font-size:13px;font-weight:500;color:#E2E8F0}
.lb-score{font-family:var(--fm);font-size:12px;color:var(--t);letter-spacing:.04em}
.lb-bar-wrap{height:3px;background:rgba(255,255,255,.08);border-radius:2px;margin-top:3px}
.lb-bar{height:3px;border-radius:2px;background:var(--g);transition:width .3s}
.lb-footer{padding:12px 18px;display:flex;align-items:center;justify-content:center;border-top:1px solid var(--r)}
.lb-footer-text{font-size:11.5px;color:var(--m);font-weight:300;font-style:italic}
/* TRUST BAR */
.tb{background:#ECEEF4;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);padding:14px 2rem}
.tbi{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:28px;flex-wrap:wrap}
.tbl{font-family:var(--fm);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8A93A8;white-space:nowrap}
.tbis{display:flex;align-items:center;gap:24px;flex-wrap:wrap}
.tbit{font-size:12.5px;font-weight:500;color:#4E5A72;letter-spacing:.02em;display:flex;align-items:center;gap:6px}
.tbit::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--b);flex-shrink:0}
/* FEATURES */
.feat{padding:5.5rem 2rem;max-width:1280px;margin:0 auto}
.sh{margin-bottom:3.5rem;display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;border-bottom:1px solid var(--bd);padding-bottom:2rem}
.sl2{font-family:var(--fm);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--b);margin-bottom:10px}
.st{font-family:var(--fd);font-size:clamp(26px,3vw,36px);font-weight:700;color:#111418;line-height:1.15;letter-spacing:-.02em}
.st em{font-style:italic;color:var(--b)}
.ss{font-size:13.5px;color:#64748B;max-width:240px;text-align:right;line-height:1.65;font-weight:300}
@media(max-width:700px){.sh{flex-direction:column;align-items:flex-start}.ss{text-align:left;max-width:none}}
.fg{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5px;background:var(--bd);border:1px solid var(--bd);border-radius:12px;overflow:hidden}
@media(max-width:800px){.fg{grid-template-columns:1fr}}
.fc{background:#fff;padding:2.25rem 2rem;position:relative;overflow:hidden;transition:background-color .2s}
.fc:hover{background:#F8FAFF}
.fc::after{content:'';position:absolute;bottom:0;left:2rem;right:2rem;height:2px;background:var(--g);transform:scaleX(0);transform-origin:left;transition:transform .3s ease}
.fc:hover::after{transform:scaleX(1)}
.fn{font-family:var(--fm);font-size:11px;letter-spacing:.1em;color:#B0BAD0;margin-bottom:1.5rem}
.fi{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem;flex-shrink:0}
.fib{background:#EBF0FD;color:var(--b)}.fit{background:#E0F8F4;color:#0EA88D}.fie{background:#E3F7F2;color:#059669}
.ftl{font-family:var(--fd);font-size:19px;font-weight:700;color:#111418;margin-bottom:10px;letter-spacing:-.01em;line-height:1.25}
.fdd{font-size:13.5px;font-weight:300;line-height:1.7;color:#64748B}
.foot{background:var(--s);border-top:1px solid var(--rs);padding:2.5rem 2rem}
.footi{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
.fc2{font-size:12.5px;color:var(--m);letter-spacing:.02em;font-weight:300}
.fc2 strong{font-weight:600;color:var(--ml)}
.ftag{font-family:var(--fm);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);border:1px solid var(--rs);padding:4px 10px;border-radius:4px}
`;

const PILLARS = ["Real-time Session Verification", "Automated Performance Matrix", "Milestone Tracking", "Live Analytics Engine", "Granular Operational Controls"] as const;
const CARDS = [
  { n:"01", ic:"fib", Icon:ClipboardList, t:"Evaluations & Tasks",    d:"Distribute milestones, manage code reviews, and capture structural output parameters across distinct operational domain paths." },
  { n:"02", ic:"fit", Icon:Users,          t:"Performance Tracking",    d:"Track member participation metrics, check-in histories, and task execution workflows from a centralized interface." },
  { n:"03", ic:"fie", Icon:CalendarCheck,  t:"Deadlines & Sprints",     d:"Configure dynamic timelines, session windows, and critical deployment sprints with strict compliance engines built-in." },
] as const;

const LB = [
  { av:"AK", cls:"av1", name:"Arjun K.",  score:980, pct:100 },
  { av:"PS", cls:"av2", name:"Priya S.",  score:940, pct:96  },
  { av:"RM", cls:"av3", name:"Rahul M.",  score:910, pct:93  },
  { av:"DL", cls:"av4", name:"Sachin L.",  score:875, pct:89  },
  { av:"ST", cls:"av5", name:"Sana T.",   score:840, pct:86  },
] as const;

export default async function Home() {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  // SMART REDIRECT LOGIC
  if (userId) {
    if (role === "cosmolix_admin") redirect("/admin");
    if (role === "teacher") redirect("/teacher");
    if (role === "student") redirect("/student");
  }

  return (
    <>
      <style>{S}</style>
      <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>

        <header className="nav">
          <div className="navi">
            <div className="brand">
              <div className="logo">
                <Image src="/logo.jpg" alt="Cosmolix Hub" width={36} height={36} priority style={{ objectFit:"contain", borderRadius:6 }} />
              </div>
              <div className="divd" aria-hidden="true" />
              <span className="btext">COSMOLIX <span className="gt">LMS</span></span>
            </div>
            <nav className="acts" aria-label="Account">
              {!userId ? (
                /* INLINE FOOTER OVERRIDE RULES INJECTED INTO TARGET MODAL ELEMENT BUTTON */
                <SignInButton 
                  mode="modal"
                  appearance={{
                    elements: {
                      footer: "hidden"
                    }
                  }}
                >
                  <button className="gp" type="button">Sign In</button>
                </SignInButton>
              ) : (
                <>
                  <Link href={`/${role || 'student'}`} className="gh">
                    <LayoutDashboard width={15} height={15} aria-hidden="true" /> Workspace
                  </Link>
                  <UserButton appearance={{ elements: { userButtonAvatarBox:"w-9 h-9" } }} />
                </>
              )}
            </nav>
          </div>
        </header>

        <main style={{ flex:1 }}>

          <section className="hero" aria-labelledby="hh">
            <div className="hgrid" aria-hidden="true" />
            <div className="gl"    aria-hidden="true" />
            <div className="gr"    aria-hidden="true" />
            <div className="hi">
              <div>
                <p className="eb"><span className="ebd" />Enterprise Workspace Tracking</p>
                <h1 className="h1" id="hh">
                  One Hub for All<br />
                  <span className="gt" style={{ fontStyle:"italic" }}>Core Metrics.</span>
                </h1>
                <p className="sub">
                  Verify presence, evaluate outputs, align sprint timelines, and monitor core 
                  progress maps across synchronized skill domains.
                </p>
                <div className="ctas">
                  {!userId ? (
                    /* HERO CALL-TO-ACTION BUTTON OVERRIDE STRUCTURE */
                    <SignInButton 
                      mode="modal"
                      appearance={{
                        elements: {
                          footer: "hidden"
                        }
                      }}
                    >
                      <button className="cp" type="button">Sign In to Workspace <ArrowRight width={16} height={16} aria-hidden="true" /></button>
                    </SignInButton>
                  ) : (
                    <Link href={`/${role || 'student'}`} className="cp">
                      Enter Workspace <ArrowRight width={16} height={16} aria-hidden="true" />
                    </Link>
                  )}
                  <span className="cs">Real-time status monitoring &amp; verification analytics</span>
                </div>
              </div>

              <aside className="aside" aria-label="Performance preview">
                <div className="lb-head">
                  <span className="lb-title">
                    <Trophy size={12} style={{ display:"inline", marginRight:5, verticalAlign:"middle", color:"#F59E0B" }} aria-hidden="true" />
                    Active Sprint Velocity
                  </span>
                  <span className="lb-badge">Preview</span>
                </div>
                {LB.map(({ av, cls, name, score, pct }, i) => (
                  <div key={name} className={`lb-row${i === 0 ? " top" : ""}`}>
                    <span className={`lb-rank${i === 0 ? " gold" : ""}`}>
                      {i === 0 ? <Medal size={13} aria-hidden="true" /> : i + 1}
                    </span>
                    <div className={`lb-avatar ${cls}`}>{av}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span className="lb-name">{name}</span>
                        <span className="lb-score">{score} pts</span>
                      </div>
                      <div className="lb-bar-wrap">
                        <div className="lb-bar" style={{ width:`${pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="lb-footer">
                  <span className="lb-footer-text">Rankings update dynamically based on metrics</span>
                </div>
              </aside>
            </div>
          </section>

          <div className="tb">
            <div className="tbi">
              <span className="tbl" aria-hidden="true">Core Platform Engine</span>
              <div className="tbis">{PILLARS.map(p => <span key={p} className="tbit">{p}</span>)}</div>
            </div>
          </div>

          <section className="feat" aria-labelledby="fh">
            <div className="sh">
              <div>
                <p className="sl2" aria-hidden="true">Platform Capabilities</p>
                <h2 className="st" id="fh">Engineered for control.<br /><em>Optimized for growth.</em></h2>
              </div>
              <p className="ss">Every architectural layer needed to deploy, verify, and monitor team milestone structures.</p>
            </div>
            <div className="fg">
              {CARDS.map(({ n, ic, Icon, t, d }) => (
                <article key={n} className="fc">
                  <p className="fn" aria-hidden="true">{n}</p>
                  <div className={`fi ${ic}`} aria-hidden="true"><Icon size={20} /></div>
                  <h3 className="ftl">{t}</h3>
                  <p className="fdd">{d}</p>
                </article>
              ))}
            </div>
          </section>

        </main>

        <footer className="foot">
          <div className="footi">
            <p className="fc2">© 2026 <strong>COSMOLIX</strong> <span className="gt" style={{ fontWeight:600 }}>LMS</span> — Engineered for Excellence.</p>
            <span className="ftag" aria-hidden="true">v2.0 · Production</span>
          </div>
        </footer>

      </div>
    </>
  );
}