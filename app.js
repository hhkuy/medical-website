/***************************
 * بيانات أمراض مبدئية (للشروع في العمل)
 ***************************/
const initialDiseases = [
  {
    id: generateUniqueId(),
    system: "CNS",
    name: "Parkinson's Disease",
    symptoms: "رعشة - بطء الحركة - تيبس العضلات",
    treatment: "العلاج الدوائي (ليفودوبا) - العلاج الفيزيائي",
    details: "يصيب العقد القاعدية في الدماغ ويؤثر على الحركة."
  },
  {
    id: generateUniqueId(),
    system: "CNS",
    name: "Alzheimer's Disease",
    symptoms: "فقدان الذاكرة - صعوبة التركيز - تغييرات سلوكية",
    treatment: "أدوية لتخفيف الأعراض مثل Donepezil - دعم نفسي",
    details: "مرض تنكسي عصبي يؤثر على الوظائف الإدراكية."
  },
  {
    id: generateUniqueId(),
    system: "CVS",
    name: "Hypertension",
    symptoms: "صداع - تعب - قد لا يوجد أعراض واضحة",
    treatment: "أدوية خافضة للضغط - تغيير نمط الحياة",
    details: "ارتفاع ضغط الدم المزمن قد يؤدي إلى مضاعفات خطيرة."
  },
];

/***************************
 * جلب الأمراض من localStorage
 ***************************/
function getDiseases() {
  let diseases = localStorage.getItem("diseasesData");
  if (diseases) {
    return JSON.parse(diseases);
  } else {
    // في حال عدم وجود بيانات مخزّنة، نضع البيانات المبدئية ونحفظها
    localStorage.setItem("diseasesData", JSON.stringify(initialDiseases));
    return initialDiseases;
  }
}

/***************************
 * حفظ الأمراض في localStorage
 ***************************/
function saveDiseases(diseases) {
  localStorage.setItem("diseasesData", JSON.stringify(diseases));
}

/***************************
 * إضافة مرض جديد
 ***************************/
function addNewDisease() {
  const system = document.getElementById("diseaseSystem").value.trim();
  const name = document.getElementById("diseaseName").value.trim();
  const symptoms = document.getElementById("diseaseSymptoms").value.trim();
  const treatment = document.getElementById("diseaseTreatment").value.trim();
  const details = document.getElementById("diseaseDetails").value.trim();

  if (!system || !name || !symptoms || !treatment) {
    alert("الرجاء تعبئة جميع الحقول المطلوبة.");
    return;
  }

  const newDisease = {
    id: generateUniqueId(),
    system,
    name,
    symptoms,
    treatment,
    details
  };

  const diseases = getDiseases();
  diseases.push(newDisease);
  saveDiseases(diseases);

  alert("تمت إضافة المرض بنجاح!");
}

/***************************
 * عرض جميع الأمراض في لوحة الإدارة
 ***************************/
function displayAllDiseasesInAdmin() {
  const container = document.getElementById("adminDiseasesList");
  if (!container) return;

  const diseases = getDiseases();
  if (diseases.length === 0) {
    container.innerHTML = "<p>لا توجد أمراض مضافة بعد.</p>";
    return;
  }

  container.innerHTML = "";
  diseases.forEach((disease) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${disease.name} (${disease.system})</h5>
        <p><strong>الأعراض:</strong> ${disease.symptoms}</p>
        <p><strong>العلاج:</strong> ${disease.treatment}</p>
        <p><strong>تفاصيل:</strong> ${disease.details || "لا توجد"}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

/***************************
 * عرض الأنظمة (Systems) في صفحة diseases.html
 ***************************/
function renderSystems() {
  const container = document.getElementById("systemsContainer");
  if (!container) return;
  
  const diseases = getDiseases();
  // الحصول على قائمة الأنظمة الفريدة
  const systems = [...new Set(diseases.map(d => d.system))];

  container.innerHTML = "";
  systems.forEach(system => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${system}</h5>
        <button class="btn btn-primary" onclick="showSystemDiseases('${system}')">
          عرض الأمراض
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

/***************************
 * عند الضغط على "عرض الأمراض" في صفحة systems
 * نقوم بإظهار قائمة الأمراض التابعة لهذا النظام
 ***************************/
function showSystemDiseases(systemName) {
  const container = document.getElementById("systemsContainer");
  if (!container) return;

  const diseases = getDiseases().filter(d => d.system === systemName);

  container.innerHTML = `
    <h2>أمراض نظام: ${systemName}</h2>
    <button class="btn btn-secondary mb-3" onclick="renderSystems()">
      العودة لاختيار الأنظمة
    </button>
  `;

  if (diseases.length === 0) {
    container.innerHTML += "<p>لا توجد أمراض في هذا النظام.</p>";
    return;
  }

  diseases.forEach(disease => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${disease.name}</h5>
        <p><strong>الأعراض:</strong> ${disease.symptoms}</p>
        <a href="disease-details.html?id=${disease.id}" class="btn btn-primary">
          التفاصيل
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

/***************************
 * عرض تفاصيل مرض معيّن في صفحة disease-details.html
 ***************************/
function renderDiseaseDetails() {
  const container = document.getElementById("diseaseDetailsContainer");
  if (!container) return;

  // جلب الـ id من الـ URL
  const params = new URLSearchParams(window.location.search);
  const diseaseId = params.get("id");
  if (!diseaseId) {
    container.innerHTML = "<p>لم يتم تحديد أي مرض.</p>";
    return;
  }

  const diseases = getDiseases();
  const disease = diseases.find(d => d.id === diseaseId);

  if (!disease) {
    container.innerHTML = "<p>عذراً، لم يتم العثور على هذا المرض.</p>";
    return;
  }

  container.innerHTML = `
    <h2>${disease.name} (${disease.system})</h2>
    <p><strong>الأعراض:</strong> ${disease.symptoms}</p>
    <p><strong>العلاج:</strong> ${disease.treatment}</p>
    <p><strong>تفاصيل أخرى:</strong> ${disease.details || "لا توجد"}</p>
    <a href="diseases.html" class="btn btn-secondary mt-3">العودة لقائمة الأمراض</a>
  `;
}

/***************************
 * خاصية البحث الفوري عن الأمراض
 ***************************/
function searchDisease(event) {
  const query = event.target.value.toLowerCase().trim();
  if (!query) return;

  // توجيه المستخدم إلى صفحة الأمراض (diseases.html) إن لم يكن فيها
  // لكن في هذا المثال سنكتفي بطباعة تنبيه أو فتح نافذة جديدة
  // يمكنك كتابة منطق مخصص للبحث والعرض حسب التصميم الذي تريده.
  alert("يتم البحث عن: " + query);
}

/***************************
 * دالة توليد معرّف فريد بسيط
 ***************************/
function generateUniqueId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
