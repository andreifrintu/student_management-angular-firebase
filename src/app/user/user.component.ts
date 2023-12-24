import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../firebase/auth';
import { UserService, FirebaseUserModel } from '../firebase/user';
import { initializeApp } from "firebase/app";
import { doc, getFirestore } from "firebase/firestore";
import { collection, getDocs, setDoc, deleteDoc } from "firebase/firestore"; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firebaseConfig } from '../firebase-config';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [UserService, AuthService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  ipAddress!: string;
  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm!: FormGroup;
  displayNameAlreadySetted: boolean = true;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    this.userService.getCurrentUser().then(user => {

      if (user.providerData[0].providerId == 'password') {
        if (user.displayName)
          this.user.name = user.displayName;
        this.user.provider = user.providerData[0].providerId;
      }
      else {
        if (user.displayName)
          this.user.name = user.displayName;
        this.user.provider = user.providerData[0].providerId;
      }
      if (!this.user.name) {
        this.displayNameAlreadySetted = true;
      }
      this.createForm(this.user.name);

      })

    this.getIPAddress();
    this.LoadTable();
  }

  createForm(name: any) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required]
    });
  }

  save() {
    this.userService.updateCurrentUser({ name: this.profileForm.controls['name'].value })
      .then(res => {
        console.log(res);
      }, err => console.log(err))
  }

  logout() {
    this.authService.doLogout().then(() => {
      this.router.navigate(['/login']);
    }, err => {
      console.log(err);
    });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((data: any) => {
      this.ipAddress = data.ip;
      
    });
  }

  LoadTable() {
    const tableContainer = document.getElementById("table-content") as HTMLTableElement;
    tableContainer.innerHTML = "<tr><th>id</th><th>name</th><th>age</th><th>grade</th><th>operations</th></tr>";
    if (tableContainer) {
      getDocs(studentsRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const newRow = tableContainer.insertRow(-1);
            
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);
            const cell5 = newRow.insertCell(4);
            
            contor = data['id'] + 1;
            cell1.innerHTML = data['id'];
            cell2.innerHTML = "<input id='name" + data['id'] + "' value='" + data['name'] + "'>";
            cell3.innerHTML = "<input id='age" + data['id'] + "' value='" + data['age'] + "'>";
            cell4.innerHTML = "<input id='grade" + data['id'] + "' value='" + data['grade'] + "'>";
            cell5.innerHTML = "<div class='d-flex gap-2'><button id='edit" + data['id'] + "' type='button' class='w-50 btn btn-secondary bg-mint mt-2 text-center'>Edit</button><button id='delete" + data['id'] + "' type='button' class='w-50 btn btn-secondary bg-mint mt-2 text-center'>Delete</button></div>";
          
            document.getElementById("edit" + data['id'])?.addEventListener("click", () => {
              edit(data['id']);
            });
            document.getElementById("delete" + data['id'])?.addEventListener("click", () => {
              del(data['id']);
            });
          });
        })
        .catch((error) => {
          console.error("Error getting documents:", error);
        });
    } else {
      console.error("Table container not found in the HTML.");
    }
    document.getElementById("addStudentButton")?.addEventListener("click", () => {
      const studentName = document.getElementById("addStudentName") as HTMLInputElement;
      const studentAge = document.getElementById("addStudentAge") as HTMLInputElement;
      const studentGrade = document.getElementById("addStudentGrade") as HTMLInputElement;
  
      add(contor, studentName ?.value, parseInt(studentAge ?.value), parseInt(studentGrade ?.value));
    });
  }
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const studentsRef = collection(db, "students");
let contor = 0;

function LoadTable() {
  const tableContainer = document.getElementById("table-content") as HTMLTableElement;
  tableContainer.innerHTML = "<tr><th>id</th><th>name</th><th>age</th><th>grade</th><th>operations</th></tr>";
  if (tableContainer) {
    getDocs(studentsRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const newRow = tableContainer.insertRow(-1);
          
          const cell1 = newRow.insertCell(0);
          const cell2 = newRow.insertCell(1);
          const cell3 = newRow.insertCell(2);
          const cell4 = newRow.insertCell(3);
          const cell5 = newRow.insertCell(4);
          
          contor = data['id'] + 1;
          cell1.innerHTML = data['id'];
          cell2.innerHTML = "<input id='name" + data['id'] + "' value='" + data['name'] + "'>";
          cell3.innerHTML = "<input id='age" + data['id'] + "' value='" + data['age'] + "'>";
          cell4.innerHTML = "<input id='grade" + data['id'] + "' value='" + data['grade'] + "'>";
          cell5.innerHTML = "<div class='d-flex gap-2'><button id='edit" + data['id'] + "' type='button' class='w-50 btn btn-secondary bg-mint mt-2 text-center'>Edit</button><button id='delete" + data['id'] + "' type='button' class='w-50 btn btn-secondary bg-mint mt-2 text-center'>Delete</button></div>";
        
          document.getElementById("edit" + data['id'])?.addEventListener("click", () => {
            edit(data['id']);
          });
          document.getElementById("delete" + data['id'])?.addEventListener("click", () => {
            del(data['id']);
          });
        });
      })
      .catch((error) => {
        console.error("Error getting documents:", error);
      });
  } else {
    console.error("Table container not found in the HTML.");
  }
  document.getElementById("addStudentButton")?.addEventListener("click", () => {
    const studentName = document.getElementById("addStudentName") as HTMLInputElement;
    const studentAge = document.getElementById("addStudentAge") as HTMLInputElement;
    const studentGrade = document.getElementById("addStudentGrade") as HTMLInputElement;

    add(contor, studentName ?.value, parseInt(studentAge ?.value), parseInt(studentGrade ?.value));
  });
}

function add(id: number, name: string, age: number, grade: number) {
  setDoc(doc(studentsRef, id.toString()), {
    id: id,
    name: name,
    age: age,
    grade: grade
  });
  contor++;
  LoadTable();
}
function edit(id: number) {
  const studentName = document.getElementById("name" + id.toString()) as HTMLInputElement;
  const studentAge = document.getElementById("age" + id.toString()) as HTMLInputElement;
  const studentGrade = document.getElementById("grade" + id.toString()) as HTMLInputElement;
  setDoc(doc(studentsRef, id.toString()), {
    id: id,
    name: studentName ?.value,
    age: parseInt(studentAge ?.value),
    grade: parseInt(studentGrade ?.value)
  });
  LoadTable();
}
function del(id: number) {
  deleteDoc(doc(studentsRef, id.toString()));
  contor--;
  LoadTable();
}
