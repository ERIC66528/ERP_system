const state={
currentUser:null,
students:[],
teachers:[],
classes:[],
payments:[],
books:[],
rooms:[],
vehicles:[],
notifications:[],
settings:{year:'2025/2026',term:'Term 1',currency:'KES',tone:'Default'}
}
const qs=(s,el=document)=>el.querySelector(s)
const qsa=(s,el=document)=>Array.from(el.querySelectorAll(s))
const save=()=>localStorage.setItem('rictei_demo',JSON.stringify(state))
const load=()=>{
const raw=localStorage.getItem('rictei_demo')
if(raw){Object.assign(state,JSON.parse(raw))}
else{seedDemo();save()}
}
const seedDemo=()=>{
state.students=[
{reg:'STU001',name:'Alice Wanjiru',class:'Form 1A',guardian:'Mary W.'},
{reg:'STU002',name:'Brian Otieno',class:'Form 2B',guardian:'Peter O.'},
{reg:'STU003',name:'Catherine Njoki',class:'Form 3A',guardian:'Susan N.'}
]
state.teachers=[
{id:'T001',name:'Mr. Kamau',subject:'Mathematics',contact:'0711001111'},
{id:'T002',name:'Mrs. Achieng',subject:'English',contact:'0711222333'}
]
state.classes=[
{class:'Form 1A',teacher:'Mr. Kamau',students:25},
{class:'Form 2B',teacher:'Mrs. Achieng',students:22}
]
state.payments=[
{receipt:'R1001',student:'Alice Wanjiru',amount:12000,method:'M-Pesa',date:'2025-08-10'},
{receipt:'R1002',student:'Brian Otieno',amount:9000,method:'Cash',date:'2025-08-12'}
]
state.books=[
{isbn:'978-1',title:'Mathematics Made Easy',author:'J. Doe',copies:3},
{isbn:'978-2',title:'English for Schools',author:'A. Writer',copies:4}
]
state.rooms=[
{room:'H101',type:'Single',capacity:1,occupied:0},
{room:'H102',type:'Double',capacity:2,occupied:1}
]
state.vehicles=[
{plate:'KAA 123A',model:'Toyota Hiace',owner:'Transit Co',status:'online'},
{plate:'KBB 456B',model:'Isuzu Lorry',owner:'LogiTrans',status:'offline'}
]
state.notifications=[
{msg:'New student registered: Alice Wanjiru',date:'2025-08-10'},
{msg:'Payment received: R1001',date:'2025-08-10'}
]
}
const initUI=()=>{
qs('#year').textContent=new Date().getFullYear()
const ham=qs('#hambtn'),side=qs('#sideNav'),close=qs('#closeNav'),logout=qs('#logoutLink'),notifBtn=qs('#notifBtn')
ham.addEventListener('click',()=>{
ham.classList.toggle('open')
side.classList.toggle('open')
side.setAttribute('aria-hidden',(!side.classList.contains('open')).toString())
})
close.addEventListener('click',()=>{ham.classList.remove('open');side.classList.remove('open');side.setAttribute('aria-hidden','true')})
qsa('[data-page]').forEach(el=>el.addEventListener('click',e=>{
const p=e.target.getAttribute('data-page')
if(p) showPage(p)
}))
qsa('.nav-list a[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const p=a.getAttribute('data-page');showPage(p);ham.classList.remove('open');side.classList.remove('open')}))
logout.addEventListener('click',e=>{e.preventDefault();doLogout()})
qs('#notifBtn').addEventListener('click',()=>{showPage('dashboard')})
qs('#demoBtn').addEventListener('click',()=>demoLogin())
qs('#loginForm').addEventListener('submit',e=>{e.preventDefault();doLogin()})
qs('#addStudentBtn').addEventListener('click',()=>openModal('Add Student',studentForm,saveStudent))
qs('#addTeacherBtn').addEventListener('click',()=>openModal('Add Teacher',teacherForm,saveTeacher))
qs('#addClassBtn').addEventListener('click',()=>openModal('Create Class',classForm,saveClass))
qs('#recordPaymentBtn').addEventListener('click',()=>openModal('Record Payment',paymentForm,savePayment))
qs('#addBookBtn').addEventListener('click',()=>openModal('Add Book',bookForm,saveBook))
qs('#addRoomBtn').addEventListener('click',()=>openModal('Add Room',roomForm,saveRoom))
qs('#addVehicleBtn').addEventListener('click',()=>openModal('Add Vehicle',vehicleForm,saveVehicle))
qs('#modalCancel').addEventListener('click',closeModal)
qs('#modalSave').addEventListener('click',()=>{qs('#modalForm').requestSubmit()})
qs('#exportStudents').addEventListener('click',exportStudentsCSV)
qs('#exportPayments').addEventListener('click',exportPaymentsCSV)
qs('#clearData').addEventListener('click',()=>{localStorage.removeItem('rictei_demo');location.reload()})
qs('#studentSearch').addEventListener('input',e=>renderStudents(e.target.value))
qs('#teacherSearch').addEventListener('input',e=>renderTeachers(e.target.value))
qs('#classSearch').addEventListener('input',e=>renderClasses(e.target.value))
qs('#feesSearch').addEventListener('input',e=>renderPayments(e.target.value))
qs('#bookSearch').addEventListener('input',e=>renderBooks(e.target.value))
qs('#hostelSearch').addEventListener('input',e=>renderRooms(e.target.value))
qs('#vehicleSearch').addEventListener('input',e=>renderVehicles(e.target.value))
qs('#notifCount').textContent=state.notifications.length
renderAll()
}
const showPage=(page)=>{
qsa('.page').forEach(p=>p.hidden=true)
const target=qs(`.page[data-page="${page}"]`)
if(target){target.hidden=false}
if(page==='dashboard'){renderDashboard()}
if(page==='students')renderStudents()
if(page==='teachers')renderTeachers()
if(page==='classes')renderClasses()
if(page==='fees')renderPayments()
if(page==='library')renderBooks()
if(page==='hostel')renderRooms()
if(page==='transport')renderVehicles()
if(page==='reports')renderReports()
if(page==='profile')renderProfile()
}
const doLogin=()=>{
const user={name:qs('#loginEmail').value || 'Admin User',role:qs('#loginRole').value}
state.currentUser=user
save()
updateProfileMini()
showPage('dashboard')
}
const demoLogin=()=>{
state.currentUser={name:'Demo Admin',role:'admin'}
save()
updateProfileMini()
showPage('dashboard')
}
const doLogout=()=>{
state.currentUser=null
save()
updateProfileMini()
showPage('login')
}
const updateProfileMini=()=>{
const mini=qs('#miniAvatar'),name=qs('#miniName')
if(state.currentUser){mini.src=avatarFor(state.currentUser.name);name.textContent=state.currentUser.name}else{mini.src='';name.textContent='Guest'}
}
const avatarFor=name=>`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0b75d1&color=fff&size=128`
const renderAll=()=>{
renderStudents();renderTeachers();renderClasses();renderPayments();renderBooks();renderRooms();renderVehicles();renderDashboard();renderNotifications();updateProfileMini()
}
const renderStudents=(filter='')=>{
const tbody=qs('#studentsTable tbody');tbody.innerHTML=''
const list=state.students.filter(s=>`${s.reg} ${s.name} ${s.class} ${s.guardian}`.toLowerCase().includes(filter.toLowerCase()))
list.forEach(s=>{
const tr=document.createElement('tr')
tr.innerHTML=`<td>${s.reg}</td><td>${s.name}</td><td>${s.class}</td><td>${s.guardian}</td><td><button class="ghost small" data-reg="${s.reg}" data-act="edit">Edit</button> <button class="ghost small" data-reg="${s.reg}" data-act="del">Delete</button></td>`
tbody.appendChild(tr)
})
qsa('#studentsTable button').forEach(btn=>{
btn.addEventListener('click',e=>{
const reg=btn.getAttribute('data-reg'),act=btn.getAttribute('data-act')
if(act==='edit'){const s=state.students.find(x=>x.reg===reg);openModal('Edit Student',studentForm,saveStudent,s)}
if(act==='del'){state.students=state.students.filter(x=>x.reg!==reg);save();renderStudents();renderDashboard()}
})
})
const recent=state.students.slice(0,6)
const recT=qs('#recentStudents tbody');recT.innerHTML='';recent.forEach(r=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${r.name}</td><td>${r.reg}</td><td>${r.class}</td>`;recT.appendChild(tr)})
}
const renderTeachers=(filter='')=>{
const tbody=qs('#teachersTable tbody');tbody.innerHTML=''
const list=state.teachers.filter(t=>`${t.id} ${t.name} ${t.subject} ${t.contact}`.toLowerCase().includes(filter.toLowerCase()))
list.forEach(t=>{
const tr=document.createElement('tr')
tr.innerHTML=`<td>${t.id}</td><td>${t.name}</td><td>${t.subject}</td><td>${t.contact}</td><td><button class="ghost small" data-id="${t.id}" data-act="edit">Edit</button> <button class="ghost small" data-id="${t.id}" data-act="del">Delete</button></td>`
tbody.appendChild(tr)
})
qsa('#teachersTable button').forEach(btn=>{
btn.addEventListener('click',e=>{
const id=btn.getAttribute('data-id'),act=btn.getAttribute('data-act')
if(act==='edit'){const t=state.teachers.find(x=>x.id===id);openModal('Edit Teacher',teacherForm,saveTeacher,t)}
if(act==='del'){state.teachers=state.teachers.filter(x=>x.id!==id);save();renderTeachers();renderDashboard()}
})
})
}
const renderClasses=(filter='')=>{
const tbody=qs('#classesTable tbody');tbody.innerHTML=''
const list=state.classes.filter(c=>`${c.class} ${c.teacher}`.toLowerCase().includes(filter.toLowerCase()))
list.forEach(c=>{
const tr=document.createElement('tr')
tr.innerHTML=`<td>${c.class}</td><td>${c.teacher}</td><td>${c.students}</td><td><button class="ghost small" data-cl="${c.class}" data-act="edit">Edit</button> <button class="ghost small" data-cl="${c.class}" data-act="del">Delete</button></td>`
tbody.appendChild(tr)
})
qsa('#classesTable button').forEach(btn=>{
btn.addEventListener('click',e=>{
const id=btn.getAttribute('data-cl'),act=btn.getAttribute('data-act')
if(act==='edit'){const c=state.classes.find(x=>x.class===id);openModal('Edit Class',classForm,saveClass,c)}
if(act==='del'){state.classes=state.classes.filter(x=>x.class!==id);save();renderClasses()}
})
})
}
const renderPayments=(filter='')=>{
const tbody=qs('#feesTable tbody');tbody.innerHTML=''
const list=state.payments.filter(p=>`${p.receipt} ${p.student} ${p.amount}`.toLowerCase().includes(filter.toLowerCase()))
list.forEach(p=>{
const tr=document.createElement('tr')
tr.innerHTML=`<td>${p.receipt}</td><td>${p.student}</td><td>${p.amount}</td><td>${p.method}</td><td>${p.date}</td><td><button class="ghost small" data-rec="${p.receipt}" data-act="view">View</button> <button class="ghost small" data-rec="${p.receipt}" data-act="del">Delete</button></td>`
tbody.appendChild(tr)
})
qsa('#feesTable button').forEach(btn=>{
btn.addEventListener('click',e=>{
const r=btn.getAttribute('data-rec'),act=btn.getAttribute('data-act')
if(act==='view'){const p=state.payments.find(x=>x.receipt===r);openModal('Payment',paymentViewForm,()=>{},p)}
if(act==='del'){state.payments=state.payments.filter(x=>x.receipt!==r);save();renderPayments();renderDashboard()}
})
})
const recent=state.payments.slice(0,6)
const recT=qs('#recentPayments tbody');recT.innerHTML='';recent.forEach(r=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${r.student}</td><td>${r.amount}</td><td>${r.date}</td>`;recT.appendChild(tr)})
}
const renderBooks=(filter='')=>{
const tbody=qs('#booksTable tbody');tbody.innerHTML=''
const list=state.books.filter(b=>`${b.isbn} ${b.title} ${b.author}`.toLowerCase().includes(filter.toLowerCase()))
list.forEach(b=>{
const tr=document.createElement('tr')
tr.innerHTML=`<td>${b.isbn}</td><td>${b.title}</td><td>${b.author}</td><td>${b.copies}</td><td><button class="ghost small" data-isbn="${b.isbn}" data-act="edit">Edit</button> <button class="ghost small" data-isbn="${b.isbn}" data-act="del">Delete</button></td>`
tbody.appendChild(tr)
})
qsa('#booksTable button').forEach(btn=>{
btn.addEventListener('click',e=>{
const id=btn.getAttribute('data-isbn'),act=btn.getAttribute('data-act')
if(act==='edit'){const b=state.books.find(x=>x.isbn===id);openModal('Edit Book',bookForm,saveBook,b)}
if(act==='del'){state.books=state.books.filter(x=>x.isbn!==id);save();renderBooks()}
})
})
}
const renderRooms=(filter='')=>{
const tbody=qs('#roomsTable tbody');tbody.innerHTML=''
const list=state.rooms.filter(r=>`${r.room} ${r.type}`.toLowerCase().includes(filter.toLowerCase()))
list.forEach(r=>{
const tr=document.createElement('tr')
tr.innerHTML=`<td>${r.room}</td><td>${r.type}</td><td>${r.capacity}</td><td>${r.occupied}</td><td><button class="ghost small" data-room="${r.room}" data-act="edit">Edit</button> <button class="ghost small" data-room="${r.room}" data-act="del">Delete</button></td>`
tbody.appendChild(tr)
})
qsa('#roomsTable button').forEach(btn=>{
btn.addEventListener('click',e=>{
const id=btn.getAttribute('data-room'),act=btn.getAttribute('data-act')
if(act==='edit'){const r=state.rooms.find(x=>x.room===id);openModal('Edit Room',roomForm,saveRoom,r)}
if(act==='del'){state.rooms=state.rooms.filter(x=>x.room!==id);save();renderRooms()}
})
})
}
const renderVehicles=(filter='')=>{
const tbody=qs('#vehiclesTable tbody');tbody.innerHTML=''
const list=state.vehicles.filter(v=>`${v.plate} ${v.model} ${v.owner}`.toLowerCase().includes(filter.toLowerCase()))
list.forEach(v=>{
const tr=document.createElement('tr')
tr.innerHTML=`<td>${v.plate}</td><td>${v.model}</td><td>${v.owner}</td><td>${v.status}</td><td><button class="ghost small" data-plate="${v.plate}" data-act="book">Book</button> <button class="ghost small" data-plate="${v.plate}" data-act="edit">Edit</button> <button class="ghost small" data-plate="${v.plate}" data-act="del">Delete</button></td>`
tbody.appendChild(tr)
})
qsa('#vehiclesTable button').forEach(btn=>{
btn.addEventListener('click',e=>{
const id=btn.getAttribute('data-plate'),act=btn.getAttribute('data-act')
if(act==='book'){openModal('Book Vehicle',vehicleBookingForm,saveVehicleBooking,state.vehicles.find(x=>x.plate===id))}
if(act==='edit'){const v=state.vehicles.find(x=>x.plate===id);openModal('Edit Vehicle',vehicleForm,saveVehicle,v)}
if(act==='del'){state.vehicles=state.vehicles.filter(x=>x.plate!==id);save();renderVehicles()}
})
})
}
const renderDashboard=()=>{
qs('#kpiStudents').textContent=state.students.length
qs('#kpiTeachers').textContent=state.teachers.length
qs('#kpiBookings').textContent=state.vehicles.filter(v=>v.status==='booked').length
const outstanding=state.payments.reduce((s,p)=>s,0)
qs('#kpiFees').textContent='KES ' + state.payments.reduce((s,p)=>s + Number(p.amount || 0),0)
renderNotifications()
}
const renderNotifications=()=>{
const list=qs('#notifList');list.innerHTML=''
state.notifications.slice(0,8).forEach(n=>{const d=document.createElement('div');d.className='notif-item';d.innerHTML=`<div>${n.msg}</div><small style="color:var(--muted)">${n.date}</small>`;list.appendChild(d)})
qs('#notifCount').textContent=state.notifications.length
}
const openModal=(title,formGenerator,onSubmit,data)=>{
qs('#modalTitle').textContent=title
const form=qs('#modalForm');form.innerHTML='';form.onsubmit=e=>{e.preventDefault();onSubmit(new FormData(form),data);save();closeModal();renderAll()}
formGenerator(form,data)
qs('#modal').hidden=false
}
const closeModal=()=>qs('#modal').hidden=true

const studentForm=(form,data)=>{
form.innerHTML=`
<input name="reg" value="${data?data.reg:generateReg('STU')}" required />
<input name="name" value="${data?data.name:''}" required />
<input name="class" value="${data?data.class:''}" />
<input name="guardian" value="${data?data.guardian:''}" />
`
}
const saveStudent=(formData,orig)=>{
const obj={reg:formData.get('reg'),name:formData.get('name'),class:formData.get('class'),guardian:formData.get('guardian')}
if(orig){const i=state.students.findIndex(s=>s.reg===orig.reg);state.students[i]=obj}
else{state.students.unshift(obj);state.notifications.unshift({msg:`Student added: ${obj.name}`,date:new Date().toISOString().slice(0,10)})}
save()
}
const teacherForm=(form,data)=>{
form.innerHTML=`
<input name="id" value="${data?data.id:generateReg('T')}" required />
<input name="name" value="${data?data.name:''}" required />
<input name="subject" value="${data?data.subject:''}" />
<input name="contact" value="${data?data.contact:''}" />
`
}
const saveTeacher=(formData,orig)=>{
const obj={id:formData.get('id'),name:formData.get('name'),subject:formData.get('subject'),contact:formData.get('contact')}
if(orig){const i=state.teachers.findIndex(t=>t.id===orig.id);state.teachers[i]=obj}
else{state.teachers.unshift(obj);state.notifications.unshift({msg:`Teacher added: ${obj.name}`,date:new Date().toISOString().slice(0,10)})}
save()
}
const classForm=(form,data)=>{
form.innerHTML=`
<input name="class" value="${data?data.class:''}" required />
<input name="teacher" value="${data?data.teacher:''}" />
<input name="students" value="${data?data.students:0}" type="number" />
`
}
const saveClass=(formData,orig)=>{
const obj={class:formData.get('class'),teacher:formData.get('teacher'),students:Number(formData.get('students')||0)}
if(orig){const i=state.classes.findIndex(c=>c.class===orig.class);state.classes[i]=obj}
else{state.classes.unshift(obj);state.notifications.unshift({msg:`Class created: ${obj.class}`,date:new Date().toISOString().slice(0,10)})}
save()
}
const paymentForm=(form,data)=>{
form.innerHTML=`
<input name="receipt" value="${data?data.receipt:generateReg('R')}" required />
<select name="student">${state.students.map(s=>`<option value="${s.name}">${s.name}</option>`).join('')}</select>
<input name="amount" value="${data?data.amount:''}" type="number" required />
<select name="method"><option>M-Pesa</option><option>Cash</option><option>Bank</option></select>
<input name="date" value="${data?data.date:new Date().toISOString().slice(0,10)}" type="date" />
`
}
const paymentViewForm=(form,data)=>{
form.innerHTML=`
<div>Receipt: ${data.receipt}</div>
<div>Student: ${data.student}</div>
<div>Amount: ${data.amount}</div>
<div>Method: ${data.method}</div>
<div>Date: ${data.date}</div>
`
}
const savePayment=(formData,orig)=>{
const obj={receipt:formData.get('receipt'),student:formData.get('student'),amount:Number(formData.get('amount')||0),method:formData.get('method'),date:formData.get('date')}
if(orig){const i=state.payments.findIndex(p=>p.receipt===orig.receipt);state.payments[i]=obj}
else{state.payments.unshift(obj);state.notifications.unshift({msg:`Payment recorded: ${obj.receipt} - ${obj.amount}`,date:obj.date})}
save()
}
const bookForm=(form,data)=>{
form.innerHTML=`
<input name="isbn" value="${data?data.isbn:generateReg('ISBN')}" required />
<input name="title" value="${data?data.title:''}" required />
<input name="author" value="${data?data.author:''}" />
<input name="copies" value="${data?data.copies:1}" type="number" />
`
}
const saveBook=(formData,orig)=>{
const obj={isbn:formData.get('isbn'),title:formData.get('title'),author:formData.get('author'),copies:Number(formData.get('copies')||1)}
if(orig){const i=state.books.findIndex(b=>b.isbn===orig.isbn);state.books[i]=obj}
else{state.books.unshift(obj);state.notifications.unshift({msg:`Book added: ${obj.title}`,date:new Date().toISOString().slice(0,10)})}
save()
}
const roomForm=(form,data)=>{
form.innerHTML=`
<input name="room" value="${data?data.room:generateReg('RM')}" required />
<input name="type" value="${data?data.type:''}" />
<input name="capacity" value="${data?data.capacity:1}" type="number" />
<input name="occupied" value="${data?data.occupied:0}" type="number" />
`
}
const saveRoom=(formData,orig)=>{
const obj={room:formData.get('room'),type:formData.get('type'),capacity:Number(formData.get('capacity')||1),occupied:Number(formData.get('occupied')||0)}
if(orig){const i=state.rooms.findIndex(r=>r.room===orig.room);state.rooms[i]=obj}
else{state.rooms.unshift(obj);state.notifications.unshift({msg:`Room added: ${obj.room}`,date:new Date().toISOString().slice(0,10)})}
save()
}
const vehicleForm=(form,data)=>{
form.innerHTML=`
<input name="plate" value="${data?data.plate:generateReg('PL')}" required />
<input name="model" value="${data?data.model:''}" />
<input name="owner" value="${data?data.owner:''}" />
<select name="status"><option ${data&&data.status==='online'?'selected':''}>online</option><option ${data&&data.status==='offline'?'selected':''}>offline</option></select>
`
}
const saveVehicle=(formData,orig)=>{
const obj={plate:formData.get('plate'),model:formData.get('model'),owner:formData.get('owner'),status:formData.get('status')}
if(orig){const i=state.vehicles.findIndex(v=>v.plate===orig.plate);state.vehicles[i]=obj}
else{state.vehicles.unshift(obj);state.notifications.unshift({msg:`Vehicle added: ${obj.plate}`,date:new Date().toISOString().slice(0,10)})}
save()
}
const vehicleBookingForm=(form,data)=>{
form.innerHTML=`
<div>Vehicle: ${data.plate} - ${data.model}</div>
<input name="bookedBy" placeholder="Booked by (name)" required />
<input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" />
<input name="dur
