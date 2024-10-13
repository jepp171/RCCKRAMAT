document.addEventListener("DOMContentLoaded", function() {
    // Menyimpan data calon debitur di localStorage
    let debtors = JSON.parse(localStorage.getItem('debtors')) || [];

    // Fungsi untuk menunjukkan halaman tertentu
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.style.display = 'block';
    } else {
        console.error(`Halaman dengan ID ${pageId} tidak ditemukan`);
    }
}

// Fungsi login untuk Sales dengan sistem restricted access
function salesLogin() {
    const salesName = document.getElementById('salesName').value;
    const salesPassword = document.getElementById('salesPassword').value;

    // Cek kredensial
    if (salesName === 'ArifRM','admin' && salesPassword === 'debrief') {
        showPage('salesDashboard');
    } else {
        alert('Nama atau kata sandi salah, silakan coba lagi.');
    }
}

    // Fungsi untuk analisis kredit
    function analyzeCredit() {
    // Periksa apakah checkbox disetujui
    const termsAccepted = document.getElementById('terms').checked;
    if (!termsAccepted) {
        alert('Harap setujui ketentuan yang berlaku sebelum melanjutkan.');
        return;
    }
        // Ambil nilai formulir
        const Nama = document.getElementById('Nama').value;
        const Namapengurus = document.getElementById('Namapengurus').value;
        const Kepengurusan = document.getElementById('Kepengurusan').value;
        const JenisUsaha = document.getElementById('JenisUsaha').value;
	const Telepon = document.getElementById('Telepon').value;
        const Pendapatan = parseFloat(document.getElementById('Pendapatan').value);
        const KewajibanBerjalan = parseFloat(document.getElementById('KewajibanBerjalan').value);
        const LamaBerusaha = parseInt(document.getElementById('LamaBerusaha').value);
        const Segmentasi = document.getElementById('Segmentasi').value;
	const Branch = document.getElementById('Branch').value;


        // Ambil nilai cicilan baru dari localStorage
        const newInstallment = parseFloat(localStorage.getItem('newInstallment')) || 0;

        // Hitung cicilan total
        const CicilanTotal = KewajibanBerjalan + newInstallment;

        // Logika analisis kredit dasar
        let analysis = '';
        let approval = '';

const incomeLoanRatio = (Pendapatan / CicilanTotal).toFixed(2);

// Tentukan apakah durasi usaha memenuhi persyaratan
let workingDurationOK = LamaBerusaha > 3;

// Tentukan hasil analisis berdasarkan kondisi
if (workingDurationOK && incomeLoanRatio < 1) {
    // Kondisi 1: Durasi usaha > 3 tahun dan incomeLoanRatio > 1
    analysis = `Maaf ${Nama}, rasio DSC Anda terlalu rendah meskipun durasi usaha anda memenuhi kriteria. Silahkan konsultasi dengan RM kami.`;
    approval = 'Pengajuan Anda tidak belum sesuai kriteria kami karena rasio DSC kurang dari 1.';
} else if (workingDurationOK && incomeLoanRatio >= 1) {
    // Kondisi 2: Durasi usaha > 3 tahun dan incomeLoanRatio <= 1
    analysis = `Selamat ${Nama}, pengajuan Anda memenuhi kriteria kami, data tersimpan.`;
    approval = 'Pengajuan Anda dapat segera diproses.Silahkan konsultasi dengan RM kami.';
} else {
    // Kondisi 3: Durasi usaha <= 3 tahun
    analysis = `Maaf ${Nama}, durasi usaha Anda terlalu singkat untuk memenuhi kriteria kami. Silahkan konsultasi dengan RM kami.`;
    approval = 'Pengajuan Anda tidak dapat disetujui karena durasi usaha kurang dari atau sama dengan 3 tahun.';
        }

// Ambil nama sales dan nomor WA dari opsi cabang
    const branchSelect = document.getElementById('Branch');
    const selectedOption = branchSelect.options[branchSelect.selectedIndex];
    const salesName = selectedOption.getAttribute('data-sales-name');
    const salesWA = selectedOption.getAttribute('data-sales-wa');

        // Simpan data calon debitur
        const debtor = {
            Nama,
            JenisUsaha,
	    Namapengurus,
	    Kepengurusan,
	    Telepon,
	    Branch,
            Pendapatan,
            KewajibanBerjalan,
            LamaBerusaha,
            CicilanTotal,
            incomeLoanRatio,
            status: approval
        };
        debtors.push(debtor);
        localStorage.setItem('debtors', JSON.stringify(debtors));

// Tampilkan hasil analisis dalam popup
    alert(`Analysis Result:\n${analysis}\n${approval}\n\nSales Name: ${salesName}\nSales WA: ${salesWA}`);


        // Reset form
        document.getElementById('creditForm').reset();
    }

    // Fungsi untuk menghitung cicilan
    function calculateInstallment() {
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const loanPeriod = parseFloat(document.getElementById('loan-period').value);

        if (loanAmount && loanPeriod) {
            const annualInterestRate = 0.12;
            const monthlyInterestRate = annualInterestRate / 12;
            const numberOfPayments = loanPeriod * 12;

            const installment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
            const formattedInstallment = installment.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

            // Simpan nilai cicilan baru di localStorage
            localStorage.setItem('newInstallment', installment.toFixed(2));

            document.getElementById('installmentResult').innerHTML = `Cicilan per bulan: ${formattedInstallment}`;
        } else {
            alert('Harap masukkan nilai pinjaman dan periode pinjaman.');
        }
    }
// Fungsi untuk memformat angka mengikuti kaidah akuntansi
function formatRupiah(angka) {
    return 'Rp ' + Number(angka).toLocaleString('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}
   // Fungsi untuk memuat daftar calon debitur di dashboard sales
function loadDebtorList() {
    const debtorList = document.getElementById('debtorList');
    debtorList.innerHTML = '<h2>Daftar Calon Debitur</h2>';
    debtors.forEach((debtor, index) => {
        const debtorItem = document.createElement('div');
        debtorItem.className = 'debtor-item';
        debtorItem.innerHTML = `
            <p><strong>Nama:</strong> ${debtor.Nama}</p>
            <p><strong>Jenis Usaha:</strong> ${debtor.JenisUsaha}</p>
            <p><strong>Nama Pengurus:</strong> ${debtor.NamaPengurus}</p>
            <p><strong>Kepengurusan:</strong> ${debtor.Kepengurusan}</p>
            <p><strong>Telepon:</strong> ${debtor.Telepon || 'Data tidak tersedia'}</p>
            <p><strong>RCC:</strong> ${debtor.Branch || 'Data tidak tersedia'}</p>
            <p><strong>Pendapatan:</strong> ${formatRupiah(debtor.Pendapatan)}</p>
            <p><strong>Lama Berusaha:</strong> ${debtor.LamaBerusaha} tahun</p>
            <p><strong>Kewajiban Berjalan:</strong> ${formatRupiah(debtor.KewajibanBerjalan)}</p>
            <p><strong>Cicilan Total:</strong> ${formatRupiah(debtor.CicilanTotal)}</p>
            <p><strong>Rasio Pendapatan terhadap Cicilan:</strong> ${debtor.incomeLoanRatio}</p>
            <p><strong>Status:</strong> ${debtor.status}</p>
            <button onclick="alert('File berhasil di-download!')">Download Berkas</button>
            <button onclick="deleteDebtor(${index})">Hapus</button>
        `;
        debtorList.appendChild(debtorItem);
    });
}

    // Fungsi untuk menghapus data calon debitur
    function deleteDebtor(index) {
        debtors.splice(index, 1);
        localStorage.setItem('debtors', JSON.stringify(debtors));
        loadDebtorList();
    }

    // Fungsi untuk menghapus semua data calon debitur
    function clearDebtors() {
        localStorage.removeItem('debtors');
        debtors = [];
        loadDebtorList();
    }

    // Muat daftar calon debitur saat halaman dimuat
    loadDebtorList();

    // Attach functions to window for access from HTML
    window.clearDebtors = clearDebtors;
    window.deleteDebtor = deleteDebtor;
    window.analyzeCredit = analyzeCredit;
    window.showPage = showPage;
    window.calculateInstallment = calculateInstallment;
window.salesLogin = salesLogin; // Attach the new login function

// Initially show the login page
    // Initially show the login page
    showPage('login');
});
