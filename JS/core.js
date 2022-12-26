 //Entry Class: Mewakili setiap entri di tempat parkir
class Entry{
    constructor(owner,car,licensePlate,entryDate,exitDate){
        this.owner = owner;
        this.car = car;
        this.licensePlate = licensePlate;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
    }
}
//UI Class: Menangani Tugas Antarmuka Pengguna
class UI{
    static displayEntries(){
   
        const entries = Store.getEntries();
        entries.forEach((entry) => UI.addEntryToTable(entry));
    }
    static addEntryToTable(entry){
        const tableBody=document.querySelector('#tableBody');
        const row = document.createElement('tr');
        row.innerHTML = `   <td>${entry.owner}</td>
                            <td>${entry.car}</td>
                            <td>${entry.licensePlate}</td>
                            <td>${entry.entryDate}</td>
                            <td>${entry.exitDate}</td>
                            <td><button class="btn btn-danger delete">X</button></td>
                        `;
        tableBody.appendChild(row);
    }
    static clearInput(){
        //menyelek semua input di ui 
        const inputs = document.querySelectorAll('.form-control');
        //menghapus semua iput 
        inputs.forEach((input)=>input.value="");
    }
    static deleteEntry(target){
        if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
        }
    }
    static showAlert(message,className){
        const div = document.createElement('div');
        div.className=`alert alert-${className} w-50 mx-auto`;
        div.appendChild(document.createTextNode(message));
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('#entryForm');
        formContainer.insertBefore(div,form);
        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }
    static validateInputs(){
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        var licensePlateRegex = /^([A-Z]{1,2}-\d{1,4}-[A-Z]{1,3})$/;
        // var licensePlateRegex = /^(?:[A-Z]{2}-\d{2}-\d{2})|(?:\d{2}-[A-Z]{2}-\d{2})|(?:\d{2}-\d{2}-[A-Z]{2})$/;
        if(owner === '' || car === '' || licensePlate === '' || entryDate === '' || exitDate === ''){
            UI.showAlert('Semua kolom harus di isi!','danger');
            return false;
        }
        if(exitDate < entryDate){
            UI.showAlert('Jam Keluar tidak boleh kurang dari jam Masuk','danger');
            return false;
        }
        if(!licensePlateRegex.test(licensePlate)){
            UI.showAlert('Plat Nomor harus sesuai dengan struktur Plat nomor Indonesia','danger');
            return false;
        }
        return true;
    }
}
//Store Class: Menangani local storage
class Store{
    static getEntries(){
        let entries;
        if(localStorage.getItem('entries') === null){
            entries = [];
        }
        else{
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }
    static addEntries(entry){
        const entries = Store.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }
    static removeEntries(licensePlate){
        const entries = Store.getEntries();
        entries.forEach((entry,index) => {
            if(entry.licensePlate === licensePlate){
                entries.splice(index, 1);
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}
//Awal mula display
    document.addEventListener('DOMContentLoaded',UI.displayEntries);
//Menambahkan
    document.querySelector('#entryForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        
        //Mendeklarasikan Variabel
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        if(!UI.validateInputs()){
            return;
        }
        //Menginisiasi Entry
        const entry = new Entry(owner, car, licensePlate, entryDate, exitDate);
        //Memasukan Entry ke tabel UI
        UI.addEntryToTable(entry);
        Store.addEntries(entry);
        //Menghapust konten dalam input secara otomatis
        UI.clearInput();

        UI.showAlert('Car successfully added to the parking lot','success');

    });
//Menghapus (Event)
    document.querySelector('#tableBody').addEventListener('click',(e)=>{
        //Memanggil fungsi di UI yang menghapus entry dari tabel
        UI.deleteEntry(e.target);
        //Mengambil plat nomer sebagai entri unik
        var licensePlate = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        //Memanggil fungsi store untuk menghapus entri dari local storege
        Store.removeEntries(licensePlate);
        //Memunculkan Alert bahwa entri sudah di apus
        UI.showAlert('Car successfully removed from the parking lot list','success');
    })

//Event Pencaharian
    document.querySelector('#searchInput').addEventListener('keyup', function searchTable(){
        //Memanggil value dari input pencarian
        const searchValue = document.querySelector('#searchInput').value.toUpperCase();
        //memanggil semua line dari tabel
        const tableLine = (document.querySelector('#tableBody')).querySelectorAll('tr');
        for(let i = 0; i < tableLine.length; i++){
            var count = 0;
            //Memanggil setiap kolom dari tiap baris
            const lineValues = tableLine[i].querySelectorAll('td');
            //for loop #2 (used to pass all the collumns)
            for(let j = 0; j < lineValues.length - 1; j++){
                //mengecek apabila kolom awalan pencarian dimulai dari string yang di input
                if((lineValues[j].innerHTML.toUpperCase()).startsWith(searchValue)){
                    count++;
                }
            }
            if(count > 0){
                tableLine[i].style.display = '';
            }else{
                tableLine[i].style.display = 'none';
            }
        }
    });