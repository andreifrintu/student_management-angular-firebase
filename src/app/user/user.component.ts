import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../firebase/auth';
import { UserService } from '../firebase/user';
import { initializeApp } from "firebase/app";
import { doc, getFirestore } from "firebase/firestore";
import { collection, getDocs, setDoc, deleteDoc } from "firebase/firestore"; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firebaseConfig } from '../firebase-config';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [UserService, AuthService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  studentsRef = collection(getFirestore(initializeApp(firebaseConfig)), "students");
  contor = 1;

  ipAddress!: string;
  date!: string;
  acc!: string;

  studentForm!: FormGroup;

  constructor(
    public afAuth: AngularFireAuth,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.studentForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(0)]],
      grade: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.LoadTable();
    this.LoadAcc();
    this.LoadDate();
    this.LoadIP();
  }

  logout() {
    this.authService.doLogout().then(() => {
      this.router.navigate(['/login']);
    }, err => {
      console.log(err);
    });
  }

  LoadAcc() {
    this.afAuth.onAuthStateChanged(user => {
      this.acc = (user?.email) ? user?.email : "";
    });
  }

  LoadIP() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((data: any) => {
      this.ipAddress = data.ip;
    });
  }

  LoadDate() {
    this.date = new Date().toLocaleDateString();
  }

  LoadTable() {
    const tableContainer = document.getElementById("table-content") as HTMLTableElement;
    tableContainer.innerHTML = "<tr><th>id</th><th>name</th><th>age</th><th>grade</th><th>operations</th></tr>";
    if (tableContainer) {
      getDocs(this.studentsRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const newRow = tableContainer.insertRow(-1);
            
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);
            const cell5 = newRow.insertCell(4);
            
            this.contor = data['id'] + 1;
            cell1.innerHTML = data['id'];
            cell2.innerHTML = "<input id='name" + data['id'] + "' value='" + data['name'] + "'>";
            cell3.innerHTML = "<input id='age" + data['id'] + "' value='" + data['age'] + "'>";
            cell4.innerHTML = "<input id='grade" + data['id'] + "' value='" + data['grade'] + "'>";
            cell5.innerHTML = "<div class='d-flex gap-2'><button id='edit" + data['id'] + "' type='button' class='w-50 btn btn-secondary bg-mint mt-2 text-center'>Edit</button><button id='delete" + data['id'] + "' type='button' class='w-50 btn btn-secondary bg-mint mt-2 text-center'>Delete</button></div>";
          
            document.getElementById("edit" + data['id'])?.addEventListener("click", () => {
              this.edit(data['id']);
            });
            document.getElementById("delete" + data['id'])?.addEventListener("click", () => {
              this.del(data['id']);
            });
          });
        })
        .catch((error) => {
          console.error("Error getting documents:", error);
        });
    } else {
      console.error("Table container not found in the HTML.");
    }
  }

  edit(id: number) {
    const studentName = document.getElementById("name" + id.toString()) as HTMLInputElement;
    const studentAge = document.getElementById("age" + id.toString()) as HTMLInputElement;
    const studentGrade = document.getElementById("grade" + id.toString()) as HTMLInputElement;
    setDoc(doc(this.studentsRef, id.toString()), {
      id: id,
      name: studentName ?.value,
      age: parseInt(studentAge ?.value),
      grade: parseInt(studentGrade ?.value)
    });
  }

  async add() {
    if (this.studentForm.valid) {
      const { name, age, grade } = this.studentForm.value;
      const id = this.contor;

      await setDoc(doc(this.studentsRef, id.toString()), { id, name, age, grade });
      this.contor++;
      this.LoadTable();
      this.studentForm.reset();
    }
  }
  
  async del(id: number) {
    await deleteDoc(doc(this.studentsRef, id.toString())).then(() => {
      this.contor--;
      this.LoadTable();
    });
  }
}
