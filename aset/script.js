const rak = [];
const keydata = "rakbuku";
const saveEvent = "evenrak";
const renderEvent = "renderrak";
function idgenerator() {
    return +new Date();
}
function simpanData() {
    if (isStorageAda()) {
        const isi = JSON.stringify(rak);
        localStorage.setItem(keydata,isi);
        document.dispatchEvent(new Event(saveEvent));
    }
}
function temuIdBuku(idbuku) {
    for(const item of rak)
    {
        if (item.id === idbuku) {
            return item;
        }
    }
    return null;
}
function temuIdBukuIndex(idbuku) {
    for(const index in rak)
    {
        if (rak[index].id === idbuku) {
            return index;
        }
    }
    return -1;
}
function rakList(id,title,author,year,isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}
function tambahData() {
    const judul = document.getElementById("judul").value;
    const penulis = document.getElementById("author").value;
    const tahun = document.getElementById("tahun").value;
    const sdhDibaca = document.getElementById("isread").checked;
    const isirak = rakList(idgenerator(),judul,penulis,tahun,sdhDibaca);
    rak.push(isirak);

    document.dispatchEvent(new Event(renderEvent));
    simpanData();
}
function loadRak() {
    const dataSerial = localStorage.getItem(keydata);
    let isi = JSON.parse(dataSerial);
    if (isi !== null) {
        for(const isidata of isi)
        {
            rak.push(isidata);
        }
    }

    document.dispatchEvent(new Event(renderEvent));
}
function isStorageAda() {
    if (typeof(Storage) == undefined) {
        alert("Simpanan Lokak Web Anda Tidak Mendukung");
        return false;
    }
    return true;
}
function buatbuku(isirak) {
    const { id, title, author, year, isCompleted } = isirak;
    const jdul = document.createElement("h2");
    jdul.innerText = title;
    const penulis = document.createElement("p");
    penulis.innerText = "Penulis : " + author;
    const thn = document.createElement("p");
    thn.innerText = "Tahun : " + year;

    const wadahact = document.createElement("div");
    wadahact.classList.add("act");
    wadahact.append(jdul,penulis,thn);

    const wadahid = document.createElement("div");
    wadahid.classList.add("idbuku");
    wadahid.append(wadahact);
    wadahid.setAttribute('id',`rak-${id}`);

    if (isCompleted) {
        wadahid.classList.add("blue");
        const uncek = document.createElement("button");
        uncek.classList.add("button");
        uncek.innerText = "Uncek";
        uncek.addEventListener('click', function () {
            uncekSelesaiBaca(id);
        });
        
        const deleteRak = document.createElement("button");
        deleteRak.classList.add("button");
        deleteRak.innerText = "Hapus";
        deleteRak.addEventListener('click', function () {
            hapusSelesaiBaca(id);
        });

        wadahid.append(uncek,deleteRak);
    }
    else {
        wadahid.classList.add("red");
        const cekSelesai = document.createElement("button");
        cekSelesai.classList.add("button");
        cekSelesai.innerText = "Tanda Selesai";
        cekSelesai.addEventListener('click', function () {
            selesaiBaca(id);
        });

        const deleteRakk = document.createElement("button");
        deleteRakk.classList.add("button");
        deleteRakk.innerText = "Hapus";
        deleteRakk.addEventListener('click', function () {
            hapusSelesaiBaca(id);
        });

        wadahid.append(cekSelesai, deleteRakk);
    }
    return wadahid;
}
function uncekSelesaiBaca(id) {
    const targetBuku = temuIdBuku(id);
    if (targetBuku == null) return;

    targetBuku.isCompleted = false;
    document.dispatchEvent(new Event(renderEvent));
    simpanData();
}
function hapusSelesaiBaca(id) {
    const targetBuku = temuIdBukuIndex(id);
    if (targetBuku === -1) return;
    
    rak.splice(targetBuku,1);
    document.dispatchEvent(new Event(renderEvent));
    simpanData();
}

function selesaiBaca(id) {
    const targetBuku = temuIdBuku(id);
    if (targetBuku == null) return;

    targetBuku.isCompleted = true;
    document.dispatchEvent(new Event(renderEvent));
    simpanData();
}
document.addEventListener('DOMContentLoaded', function () {
    const submitBuku = document.getElementById("tambahrak");
    submitBuku.addEventListener('submit',function (event) {
        event.preventDefault();
        tambahData();
    });
    if ( isStorageAda() ) {
        loadRak();
    }
});

document.addEventListener(saveEvent, () => {
    console.log("Data Tersimpan");
});

document.addEventListener(renderEvent,function () {
    const belumSelesai = document.getElementById("notyet");
    const selesai = document.getElementById("doneread");

    belumSelesai.innerHTML = '';
    selesai.innerHTML = '';

    for(const item of rak)
    {
        const elemenRak = buatbuku(item);
        if (item.isCompleted) {
            selesai.append(elemenRak);
        }
        else {
            belumSelesai.append(elemenRak);
        }
    }
});