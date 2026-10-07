const state={page:"home",authMode:"signup",posts:[
{id:1,user:"Anonymous Citizen",handle:"@anonymous",time:"18 min ago",cat:"Road & Transport",title:"Large road surface damage near the roadside",desc:"A deep damaged section is making it difficult for two-wheelers to pass safely. Several vehicles are slowing down around this spot.",type:"road",hype:4283,confirm:642,evidence:31,comments:["I observed the same issue yesterday.","This has been getting worse recently."],hyped:false,confirmed:false,saved:false},
{id:2,user:"Ayesha Khan",handle:"@ayeshak",time:"1 hr ago",cat:"Waste",title:"Garbage accumulation around the public space",desc:"Uncollected waste has accumulated near the roadside area. The issue appears to have continued for several days.",type:"garbage",hype:2840,confirm:431,evidence:18,comments:["Same situation this morning."],hyped:false,confirmed:false,saved:false},
{id:3,user:"Anonymous Citizen",handle:"@anonymous",time:"3 hrs ago",cat:"Water",title:"Possible water leakage on the street",desc:"Water is continuously collecting near the road edge. Community members may want to verify whether this is an active leakage.",type:"water",hype:1910,confirm:286,evidence:12,comments:[],hyped:false,confirmed:false,saved:false},
{id:4,user:"Rohan Mehta",handle:"@rohanm",time:"5 hrs ago",cat:"Infrastructure",title:"Broken streetlight needs attention",desc:"One of the streetlights in this stretch appears to be non-functional after dark.",type:"infrastructure",hype:1240,confirm:198,evidence:9,comments:[],hyped:false,confirmed:false,saved:false}
]};

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function openModal(){ $("#postModal").classList.add("open") }
function closeModal(){ $("#postModal").classList.remove("open") }
function fmt(n){return n>=1000?(n/1000).toFixed(n>=10000?0:1)+"K":n}
function media(type){return `<div class="issue-media ${type}"><span>${type==="road"?"⚠":type==="garbage"?"♻":type==="water"?"≈":"⚡"}</span></div>`}
function postCard(p){
return `<article class="post-card">
<div class="post-head"><div class="avatar">${p.user==="Anonymous Citizen"?"A":p.user[0]}</div><div class="post-author"><b>${p.user}</b><small>${p.handle} · ${p.time} · ⌖ Approx. Central Delhi</small></div><span class="post-tag">${p.cat}</span><button class="post-menu">•••</button></div>
${media(p.type)}
<div class="issue-caption"><h3>${p.title}</h3><p>${p.desc}</p></div>
<div class="post-actions">
<button class="act ${p.hyped?"active":""}" onclick="hype(${p.id})"><span>🔥</span> Hype ${fmt(p.hype)}</button>
<button class="act ${p.confirmed?"active":""}" onclick="confirmIssue(${p.id})"><span>✓</span> Confirm ${fmt(p.confirm)}</button>
<button class="act" onclick="comments(${p.id})"><span>💬</span> Discuss</button>
<button class="act" onclick="savePost(${p.id})"><span>${p.saved?"♥":"♡"}</span> ${p.saved?"Saved":"Save"}</button>
</div>
<div class="comment-area" id="comments-${p.id}">${p.comments.map(c=>`<div class="comment-line"><b>Community member</b> · ${c}</div>`).join("")}<div class="comment-input"><input id="ci-${p.id}" placeholder="Add context..."><button onclick="addComment(${p.id})">Post</button></div></div>
</article>`}
function renderHome(){
const saved=$("#globalSearch").value.trim().toLowerCase();
let arr=state.posts.filter(p=>!saved||[p.title,p.desc,p.cat,p.user].join(" ").toLowerCase().includes(saved));
$("#page").innerHTML=`<div class="page-wrap"><div class="page-head"><div><h1>Community Feed</h1><p>What people are observing around your community</p></div><button class="primary" style="height:36px;padding:0 13px" onclick="openModal()">＋ Create</button></div>
<div class="feed-tabs"><button class="active">For you</button><button>Following</button><button>Nearby</button></div>${arr.map(postCard).join("")||"<div class='side-card'>No issues found.</div>"}</div>`;
renderSideTrending()}
function renderExplore(){
$("#page").innerHTML=`<div class="page-wrap"><div class="page-head"><div><h1>Explore</h1><p>Discover issues, communities and local conversations</p></div></div><div class="explore-grid">
<div class="explore-card"><div class="big-icon">🔥</div><h3>Road & Transport</h3><p>1.8K active observations around roads, traffic and public transport.</p></div>
<div class="explore-card"><div class="big-icon">♻️</div><h3>Waste & Cleanliness</h3><p>640 community observations and growing.</p></div>
<div class="explore-card"><div class="big-icon">💧</div><h3>Water</h3><p>Track leakage, flooding and water-related local issues.</p></div>
<div class="explore-card"><div class="big-icon">🌱</div><h3>Environment</h3><p>Pollution, green spaces and environmental observations.</p></div>
</div><div class="page-head" style="margin-top:28px"><div><h1>Trending issues</h1><p>Ranked using Hype, confirmations and evidence</p></div></div>${[...state.posts].sort((a,b)=>b.hype-a.hype).map(postCard).join("")}</div>`}
function renderNotifications(){ $("#page").innerHTML=`<div class="page-wrap"><div class="page-head"><div><h1>Notifications</h1><p>Stay updated on your community activity</p></div></div><div class="side-card">${["🔥 18 people added Hype to your observation","✓ Ayesha confirmed the road issue you posted","💬 Rohan commented on a community issue","🛡 Your anonymous identity was protected on a post"].map((x,i)=>`<div class="setting"><div class="setting-icon">${x[0]}</div><div><b>${x.slice(2)}</b><small>${i+1} hour${i?"s":""} ago</small></div></div>`).join("")}</div></div>`}
function renderMessages(){ $("#page").innerHTML=`<div class="page-wrap"><div class="page-head"><div><h1>Messages</h1><p>Community conversations and direct messages</p></div></div><div class="side-card"><div class="setting"><div class="avatar">R</div><div><b>Road Watch Delhi</b><small>Can you verify the location of this issue? · 8m</small></div></div><div class="setting"><div class="avatar">A</div><div><b>Ayesha Khan</b><small>I added supporting evidence to the post. · 1h</small></div></div><div class="setting"><div class="avatar">C</div><div><b>Clean City Community</b><small>New discussion about garbage collection · 3h</small></div></div></div></div>`}
function renderSaved(){let a=state.posts.filter(p=>p.saved);$("#page").innerHTML=`<div class="page-wrap"><div class="page-head"><div><h1>Saved</h1><p>Your private collection of community posts</p></div></div>${a.length?a.map(postCard).join(""):"<div class='side-card' style='text-align:center;padding:40px'><div style='font-size:30px'>♡</div><h3 style='font-size:12px'>Nothing saved yet</h3><p style='font-size:9px;color:#667085'>Save useful issues to find them here later.</p></div>"}</div>`}
function renderProfile(){ $("#page").innerHTML=`<div class="page-wrap"><div class="profile-cover"></div><div class="profile-info"><div class="avatar">G</div><h2>Gaurav Sagar</h2><p>@gaurav · Temporary public profile</p><p style="margin-top:9px">Documenting local issues and helping the community verify what matters.</p><div class="stats"><div><b>24</b><small>Posts</small></div><div><b>1.8K</b><small>Hype received</small></div><div><b>312</b><small>Confirmations</small></div><div><b>12</b><small>Evidence</small></div></div></div></div>`}
function renderSettings(){ $("#page").innerHTML=`<div class="page-wrap"><div class="page-head"><div><h1>Settings</h1><p>Control your account, privacy and public identity</p></div></div><div class="settings-card">
<div class="setting"><div class="setting-icon">🛡</div><div><b>Anonymous posting</b><small>Hide your public identity on selected posts.</small></div><button onclick="toast('Anonymous posting is ON')">ON</button></div>
<div class="setting"><div class="setting-icon">⌖</div><div><b>Approximate location</b><small>Never show exact coordinates publicly.</small></div><button>ON</button></div>
<div class="setting"><div class="setting-icon">◷</div><div><b>Default content lifetime</b><small>New posts expire after 7 days.</small></div><button>7 days</button></div>
<div class="setting"><div class="setting-icon">◉</div><div><b>Public profile lifetime</b><small>Your public profile is temporary by design.</small></div><button>30 days</button></div>
<div class="setting"><div class="setting-icon">✦</div><div><b>AI assistance</b><small>Descriptions, categories and moderation suggestions.</small></div><button>ON</button></div>
<div class="setting"><div class="setting-icon">🔒</div><div><b>Account & security</b><small>Password, login sessions and verification.</small></div><button>Manage</button></div>
</div></div>`}
function renderSideTrending(){let a=[...state.posts].sort((x,y)=>y.hype-x.hype).slice(0,4);$("#sideTrending").innerHTML=a.map((p,i)=>`<div class="trend-item"><span>${String(i+1).padStart(2,"0")}</span><div><b>${p.title}</b><small>${fmt(p.confirm)} confirmations</small></div><em>${fmt(p.hype)}</em></div>`).join("")}
function render(){({home:renderHome,explore:renderExplore,notifications:renderNotifications,messages:renderMessages,saved:renderSaved,profile:renderProfile,settings:renderSettings}[state.page]||renderHome)();$$(".nav-link[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===state.page))}
$$(".nav-link[data-page]").forEach(b=>b.addEventListener("click",()=>{state.page=b.dataset.page;render()}));
$$("[data-page='explore']").forEach(b=>b.addEventListener("click",()=>{state.page="explore";render()}));
$("#createBtn").onclick=openModal;$("#mobileCreate").onclick=openModal;
$$("[data-close]").forEach(b=>b.onclick=()=>$("#"+b.dataset.close).classList.remove("open"));
$("#postModal").onclick=e=>{if(e.target.id==="postModal")closeModal()};
$("#globalSearch").addEventListener("input",()=>{if(state.page!=="home")state.page="home";render()});
$("#mediaInput").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const c=$("#mediaContent");if(f.type.startsWith("image/")){const u=URL.createObjectURL(f);c.innerHTML=`<img class="preview-media" src="${u}">`}else c.innerHTML=`<span class="upload-symbol">▶</span><b>${f.name}</b><small>Video selected</small>`;$("#postModal .ai-assist em").textContent="Analyzing...";setTimeout(()=>{$("#postModal .ai-assist em").textContent="Suggestion ready";if(!$("#postText").value)$("#postText").value="Possible community issue detected. Please review this AI-generated description before publishing.";toast("AI suggestion ready — review before publishing.")},900)});
$("#publishPost").onclick=()=>{const text=$("#postText").value.trim()||"Community issue shared for local observation and verification.";state.posts.unshift({id:Date.now(),user:$("#postIdentity").textContent==="Anonymous Citizen"?"Anonymous Citizen":"Gaurav Sagar",handle:$("#postIdentity").textContent==="Anonymous Citizen"?"@anonymous":"@gaurav",time:"Just now",cat:"Road & Transport",title:"New community observation",desc:text,type:"road",hype:0,confirm:0,evidence:0,comments:[],hyped:false,confirmed:false,saved:false});$("#postText").value="";$("#mediaContent").innerHTML=`<span class="upload-symbol">＋</span><b>Add photo or video</b><small>Show the issue clearly. Up to 60 seconds.</small>`;closeModal();state.page="home";render();toast("Post published successfully 🎉")};
$("#identityToggle").onclick=()=>{const x=$("#postIdentity");x.textContent=x.textContent==="Anonymous Citizen"?"Gaurav Sagar":"Anonymous Citizen";toast("Posting identity changed")};
$("#logout").onclick=()=>{$("#appScreen").classList.add("hidden");$("#authScreen").classList.remove("hidden");toast("Logged out")};
function setAuth(mode){state.authMode=mode;const login=mode==="login";$("#authTitle").textContent=login?"Welcome back":"Create your account";$("#authSub").textContent=login?"Log in to continue to your community.":"Join your local community and help document what matters.";$("#nameField").classList.toggle("hidden",login);$("#terms").classList.toggle("hidden",login);$("#authSubmit").textContent=login?"Log in":"Create account";$(".switch-auth").innerHTML=login?'New to CivicPlus? <button class="link-btn" data-auth="signup">Create account</button>':'Already have an account? <button class="link-btn" data-auth="login">Log in</button>';$$("[data-auth]").forEach(x=>x.onclick=()=>setAuth(x.dataset.auth))}
$$("[data-auth]").forEach(x=>x.onclick=()=>setAuth(x.dataset.auth));
$("#authForm").onsubmit=e=>{e.preventDefault();$("#authScreen").classList.add("hidden");$("#appScreen").classList.remove("hidden");state.page="home";render();toast(state.authMode==="login"?"Welcome back 👋":"Welcome to CivicPlus 🎉")};
$$(".password button").forEach(b=>b.onclick=()=>{const i=b.previousElementSibling;i.type=i.type==="password"?"text":"password";b.textContent=i.type==="password"?"Show":"Hide"});
renderSideTrending();
