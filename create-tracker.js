#!/usr/bin/env node
/**
 * Employee Task Tracker Generator
 * Usage:
 *   node create-tracker.js                  → creates employee-task-tracker.html in current folder
 *   node create-tracker.js ./output         → creates in ./output folder
 *   node create-tracker.js ~/Desktop        → creates on Desktop
 */

const fs   = require('fs');
const path = require('path');

const outputDir  = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const outputFile = path.join(outputDir, 'employee-task-tracker.html');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Employee Task Tracker</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; color: #333; min-height: 100vh; }
    header {
      background: linear-gradient(135deg, #2563eb, #1e40af);
      color: white; padding: 20px 32px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    header h1 { font-size: 1.5rem; font-weight: 700; }
    header span { font-size: 0.85rem; opacity: 0.8; }
    .container { max-width: 1200px; margin: 32px auto; padding: 0 24px; }
    .card { background: white; border-radius: 12px; padding: 28px; box-shadow: 0 1px 6px rgba(0,0,0,0.08); margin-bottom: 32px; }
    .card h2 { font-size: 1.1rem; font-weight: 600; margin-bottom: 20px; color: #1e40af; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 0.8rem; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.04em; }
    .form-group input, .form-group select {
      padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;
      font-size: 0.95rem; transition: border-color 0.2s; background: #fafafa;
    }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #2563eb; background: white; }
    .form-actions { margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap; }
    .btn { padding: 10px 22px; border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #2563eb; color: white; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { background: #e5e7eb; color: #374151; }
    .btn-secondary:hover { background: #d1d5db; }
    .btn-danger { background: #fee2e2; color: #b91c1c; }
    .btn-danger:hover { background: #fecaca; }
    .btn-success { background: #dcfce7; color: #166534; }
    .btn-success:hover { background: #bbf7d0; }
    .toolbar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
    .toolbar input, .toolbar select { padding: 9px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; background: white; }
    .toolbar input:focus, .toolbar select:focus { outline: none; border-color: #2563eb; }
    .toolbar input { flex: 1; min-width: 200px; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    thead th {
      background: #f8fafc; color: #6b7280; font-size: 0.78rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 14px;
      text-align: left; border-bottom: 2px solid #e5e7eb; white-space: nowrap;
      cursor: pointer; user-select: none;
    }
    thead th:hover { color: #2563eb; }
    tbody tr { border-bottom: 1px solid #f1f5f9; transition: background 0.15s; }
    tbody tr:hover { background: #f8fafc; }
    tbody td { padding: 13px 14px; vertical-align: middle; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .badge-todo      { background: #fef9c3; color: #854d0e; }
    .badge-progress  { background: #dbeafe; color: #1d4ed8; }
    .badge-review    { background: #ede9fe; color: #6d28d9; }
    .badge-done      { background: #dcfce7; color: #166534; }
    .badge-blocked   { background: #fee2e2; color: #991b1b; }
    .action-btns { display: flex; gap: 8px; }
    .btn-sm { padding: 5px 12px; font-size: 0.82rem; border-radius: 6px; }
    .empty-state { text-align: center; padding: 48px 20px; color: #9ca3af; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin-bottom: 32px; }
    .stat-card { background: white; border-radius: 10px; padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); text-align: center; }
    .stat-card .num { font-size: 2rem; font-weight: 700; color: #2563eb; }
    .stat-card .lbl { font-size: 0.78rem; color: #6b7280; margin-top: 4px; }
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 100; align-items: center; justify-content: center; }
    .modal-overlay.open { display: flex; }
    .modal { background: white; border-radius: 14px; padding: 32px; width: 90%; max-width: 580px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); }
    .modal h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; color: #1e40af; }
    .modal .form-grid { grid-template-columns: 1fr 1fr; }
    .modal .form-actions { justify-content: flex-end; margin-top: 20px; }
    .toast { position: fixed; bottom: 28px; right: 28px; background: #1e40af; color: white; padding: 12px 22px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; opacity: 0; transform: translateY(16px); transition: all 0.3s; z-index: 999; pointer-events: none; }
    .toast.show { opacity: 1; transform: translateY(0); }
    @media (max-width: 600px) {
      .modal .form-grid { grid-template-columns: 1fr; }
      header { flex-direction: column; gap: 6px; text-align: center; }
    }
  </style>
</head>
<body>
<header>
  <h1>🗂️ Employee Task Tracker</h1>
  <span id="lastSaved"></span>
</header>
<div class="container">
  <div class="stats" id="stats"></div>
  <div class="card">
    <h2>➕ Add New Task</h2>
    <div class="form-grid">
      <div class="form-group"><label>Employee Name</label><input type="text" id="empName" placeholder="e.g. Alice Johnson" /></div>
      <div class="form-group"><label>Task Name</label><input type="text" id="taskName" placeholder="e.g. Design mockup" /></div>
      <div class="form-group"><label>Start Date</label><input type="date" id="startDate" /></div>
      <div class="form-group"><label>Time Spent (hrs)</label><input type="number" id="timeSpent" placeholder="e.g. 3.5" min="0" step="0.5" /></div>
      <div class="form-group"><label>Status</label>
        <select id="status">
          <option>To Do</option><option>In Progress</option><option>In Review</option><option>Done</option><option>Blocked</option>
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="addTask()">Add Task</button>
      <button class="btn btn-secondary" onclick="clearForm()">Clear</button>
    </div>
  </div>
  <div class="card">
    <h2>📋 All Tasks</h2>
    <div class="toolbar">
      <input type="text" id="searchInput" placeholder="🔍 Search by employee or task…" oninput="renderTable()" />
      <select id="filterStatus" onchange="renderTable()">
        <option value="">All Statuses</option>
        <option>To Do</option><option>In Progress</option><option>In Review</option><option>Done</option><option>Blocked</option>
      </select>
      <button class="btn btn-success btn-sm" onclick="exportCSV()">⬇️ Export CSV</button>
      <button class="btn btn-secondary btn-sm" onclick="importJSON()">📂 Import JSON</button>
      <button class="btn btn-secondary btn-sm" onclick="exportJSON()">💾 Save as JSON</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th onclick="sortBy('empName')">Employee ⇅</th>
            <th onclick="sortBy('taskName')">Task ⇅</th>
            <th onclick="sortBy('startDate')">Start Date ⇅</th>
            <th onclick="sortBy('timeSpent')">Time (hrs) ⇅</th>
            <th onclick="sortBy('status')">Status ⇅</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    </div>
  </div>
</div>
<div class="modal-overlay" id="editModal">
  <div class="modal">
    <h2>✏️ Edit Task</h2>
    <div class="form-grid">
      <div class="form-group"><label>Employee Name</label><input type="text" id="editEmpName" /></div>
      <div class="form-group"><label>Task Name</label><input type="text" id="editTaskName" /></div>
      <div class="form-group"><label>Start Date</label><input type="date" id="editStartDate" /></div>
      <div class="form-group"><label>Time Spent (hrs)</label><input type="number" id="editTimeSpent" min="0" step="0.5" /></div>
      <div class="form-group" style="grid-column: span 2"><label>Status</label>
        <select id="editStatus">
          <option>To Do</option><option>In Progress</option><option>In Review</option><option>Done</option><option>Blocked</option>
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveEdit()">Save Changes</button>
    </div>
  </div>
</div>
<input type="file" id="jsonFileInput" accept=".json" style="display:none" onchange="handleImport(event)" />
<div class="toast" id="toast"></div>
<script>
  let tasks = JSON.parse(localStorage.getItem('etTasks') || '[]');
  let editIndex = null, sortKey = 'startDate', sortAsc = true;
  const STATUS_BADGE = { 'To Do':'badge-todo','In Progress':'badge-progress','In Review':'badge-review','Done':'badge-done','Blocked':'badge-blocked' };
  function save() {
    localStorage.setItem('etTasks', JSON.stringify(tasks));
    document.getElementById('lastSaved').textContent = 'Auto-saved ' + new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  }
  function showToast(msg) {
    const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }
  function addTask() {
    const empName=document.getElementById('empName').value.trim(), taskName=document.getElementById('taskName').value.trim(),
          startDate=document.getElementById('startDate').value, timeSpent=parseFloat(document.getElementById('timeSpent').value),
          status=document.getElementById('status').value;
    if (!empName||!taskName||!startDate||isNaN(timeSpent)||timeSpent<0){alert('Please fill in all fields.');return;}
    tasks.push({id:Date.now(),empName,taskName,startDate,timeSpent,status}); save(); clearForm(); renderAll(); showToast('✅ Task added!');
  }
  function clearForm() {
    ['empName','taskName','timeSpent'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('startDate').valueAsDate=new Date(); document.getElementById('status').value='To Do';
  }
  function deleteTask(idx) {
    if(!confirm('Delete this task?'))return; tasks.splice(idx,1); save(); renderAll(); showToast('🗑️ Task deleted.');
  }
  function openEdit(idx) {
    editIndex=idx; const t=tasks[idx];
    document.getElementById('editEmpName').value=t.empName; document.getElementById('editTaskName').value=t.taskName;
    document.getElementById('editStartDate').value=t.startDate; document.getElementById('editTimeSpent').value=t.timeSpent;
    document.getElementById('editStatus').value=t.status; document.getElementById('editModal').classList.add('open');
  }
  function closeModal(){document.getElementById('editModal').classList.remove('open');editIndex=null;}
  function saveEdit() {
    const empName=document.getElementById('editEmpName').value.trim(), taskName=document.getElementById('editTaskName').value.trim(),
          startDate=document.getElementById('editStartDate').value, timeSpent=parseFloat(document.getElementById('editTimeSpent').value),
          status=document.getElementById('editStatus').value;
    if(!empName||!taskName||!startDate||isNaN(timeSpent)||timeSpent<0){alert('Please fill in all fields.');return;}
    tasks[editIndex]={...tasks[editIndex],empName,taskName,startDate,timeSpent,status};
    save(); closeModal(); renderAll(); showToast('✏️ Task updated!');
  }
  document.getElementById('editModal').addEventListener('click',function(e){if(e.target===this)closeModal();});
  function sortBy(key){if(sortKey===key)sortAsc=!sortAsc;else{sortKey=key;sortAsc=true;}renderTable();}
  function getSorted(list){return[...list].sort((a,b)=>{let va=a[sortKey],vb=b[sortKey];if(sortKey==='timeSpent'){va=+va;vb=+vb;}return va<vb?(sortAsc?-1:1):va>vb?(sortAsc?1:-1):0;});}
  function getFiltered(){
    const search=document.getElementById('searchInput').value.toLowerCase(), status=document.getElementById('filterStatus').value;
    return tasks.filter(t=>(!search||t.empName.toLowerCase().includes(search)||t.taskName.toLowerCase().includes(search))&&(!status||t.status===status));
  }
  function renderTable(){
    const sorted=getSorted(getFiltered()); const tbody=document.getElementById('tableBody');
    if(!sorted.length){tbody.innerHTML='<tr><td colspan="6"><div class="empty-state"><p style="font-size:2.5rem;margin-bottom:8px">📄</p><p>No tasks found. Add one above!</p></div></td></tr>';return;}
    tbody.innerHTML=sorted.map(t=>{
      const idx=tasks.indexOf(t), bc=STATUS_BADGE[t.status]||'badge-todo';
      const ds=t.startDate?new Date(t.startDate+'T00:00:00').toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'—';
      return \`<tr><td><strong>\${esc(t.empName)}</strong></td><td>\${esc(t.taskName)}</td><td>\${ds}</td><td>\${t.timeSpent} hrs</td><td><span class="badge \${bc}">\${esc(t.status)}</span></td><td><div class="action-btns"><button class="btn btn-secondary btn-sm" onclick="openEdit(\${idx})">Edit</button><button class="btn btn-danger btn-sm" onclick="deleteTask(\${idx})">Delete</button></div></td></tr>\`;
    }).join('');
  }
  function renderStats(){
    const total=tasks.length, done=tasks.filter(t=>t.status==='Done').length,
          inProg=tasks.filter(t=>t.status==='In Progress').length, blocked=tasks.filter(t=>t.status==='Blocked').length,
          totalHrs=tasks.reduce((s,t)=>s+(+t.timeSpent||0),0), emps=new Set(tasks.map(t=>t.empName.trim().toLowerCase())).size;
    document.getElementById('stats').innerHTML=[
      {num:total,lbl:'Total Tasks'},{num:emps,lbl:'Employees'},{num:inProg,lbl:'In Progress'},
      {num:done,lbl:'Done'},{num:blocked,lbl:'Blocked'},{num:totalHrs.toFixed(1),lbl:'Total Hours'}
    ].map(s=>\`<div class="stat-card"><div class="num">\${s.num}</div><div class="lbl">\${s.lbl}</div></div>\`).join('');
  }
  function renderAll(){renderStats();renderTable();}
  function exportCSV(){
    if(!tasks.length){alert('No tasks to export.');return;}
    const headers=['Employee Name','Task Name','Start Date','Time Spent (hrs)','Status'];
    const rows=tasks.map(t=>[t.empName,t.taskName,t.startDate,t.timeSpent,t.status].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','));
    download([headers.join(','),...rows].join('\\n'),'employee_tasks.csv','text/csv'); showToast('⬇️ CSV exported!');
  }
  function exportJSON(){
    if(!tasks.length){alert('No tasks to export.');return;}
    download(JSON.stringify(tasks,null,2),'employee_tasks.json','application/json'); showToast('💾 JSON saved!');
  }
  function importJSON(){document.getElementById('jsonFileInput').click();}
  function handleImport(e){
    const file=e.target.files[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=function(ev){
      try{
        const imported=JSON.parse(ev.target.result);
        if(!Array.isArray(imported))throw new Error('Not an array');
        const valid=imported.filter(t=>t.empName&&t.taskName&&t.startDate&&t.status!==undefined);
        if(!valid.length)throw new Error('No valid tasks found');
        const choice=confirm('Found '+valid.length+' task(s).\\n\\nOK = REPLACE all tasks.\\nCancel = MERGE with existing.');
        if(choice){tasks=valid;}else{const ids=new Set(tasks.map(t=>t.id));valid.forEach(t=>{if(!ids.has(t.id))tasks.push(t);});}
        save(); renderAll(); showToast('📂 Imported '+valid.length+' task(s)!');
      }catch(err){alert('Import failed: '+err.message);}
    };
    reader.readAsText(file); e.target.value='';
  }
  function download(content,filename,type){
    const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
  }
  function esc(str){return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  document.getElementById('startDate').valueAsDate=new Date();
  renderAll();
<\/script>
</body>
</html>`;

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, html, 'utf8');

console.log('');
console.log('✅  Employee Task Tracker created!');
console.log('');
console.log('   📄 File : ' + outputFile);
console.log('');
console.log('   👉 Open it: double-click the file, or run:');
console.log('      open "' + outputFile + '"');
console.log('');
