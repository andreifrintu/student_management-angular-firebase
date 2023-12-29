# StudentManagementAngularFirebase

Această aplicație a fost creată folosind framework-ul Angular, împreună cu baza de date Firebase, și este concepută pentru a fi folosită de profesori, pentru a introduce în clase elevii și pentru a executa diverse acțiuni asupra lor.

## Construcția aplicației

Platforma Web folosește la bază 5 componente, acestea sunt:
- **navbar** = bara de navigație a aplicației, prezentă în toate rutele
- **footer** = subsolul aplicației, prezent în toate paginiile
- **login** = componenta folosită pentru conectarea utilizatorului
- **register** = componenta folosită pentru a crea noi conturi pentru profesori
- **user** = componenta interfeței pentru utilizatorii conectați

## Rutele din aplicație

Aplicația folosește mai multe rute:
- / (root) = **rută publică**, redirecționează utilizatorul la pagina de login
- /login = **rută publică**, pagina unde utilizatorul se poate conecta la aplicație
- /register = **rută publică**, pagina unde se poate crea un cont nou
- /dashboard = **rută privată**, pagina de administrare a studenților

## Funcționarea aplicației

### Sistemul de login & register

Conturile folosite în aplicație sunt integrate in pachetul **AngularFirebaseAuthentication**, procesul de înregistrat și conectare fiind realizate de librărie. Fiecare cont are un E-mail și o parolă, toate conturile fiind considerate profesori. Formularul de înscriere, respectiv cel de conectare sunt identificate ca obiecte **FormBuilder**, aparținând de '@angular/forms'. 

În cazul în care operația de conectare se realizează cu succes, statusul gărzii de autentificare va fi modificat, utilizatorul primind acces, și fiind redirecționat doar spre pagina de administare (/dashboard). În cazul în care utilizatorul se deconectează sau sesiunea conectată expiră, garda va fi resetată, iar utilizatorul va fi trimis la pagina de conectare (/login).

### Pagina de administare

După ce procesul de conectare a fost finalizat cu succes, toate rutele vor redirecționa utilizatorul către pagina de administare. De aici, vor putea fi executate operații asupra studenților.

În partea stângă a paginii se află informații despre utilizatorul conectat, precum adresa acestuia de E-mail și adresa IP, dar și data de astăzi. 

În partea dreaptă a paginii se află formularul de creare student, la fel ca restul formularelor din aplicație, la trimitere, obiectul de tip FormBuilder va crea un request **setDoc()**, care va adăuga în tabelul referențiat, cel de studenți, datele trimise de utilizator. Documentele create în Firebase primesc un identificator în funcție de variabila de contorizare, pornind de la 1.

În centrul paginii, diviunea care ocupă jumătate din lățimea ecranului este tabelul cu studenți, aici se afisează la inițierea componentei, după primirea răspunsului din Firebase, câte un rând pentru fiecare student. Pentru fiecare dintre aceștia se scrie id-ul din baza de date, adică identificatorul documentului, numele, vârsta, clasa, și o coloană de operații. 

Operațiile care pot fi aplicate studenților sunt cea de ștergere, care apelează funcția **deleteDoc()**, folosind identificatorul unic al documentului pentru a elimina studentul din baza de date, respectiv cea de editare. Câmpurile de nume, vârstă și clasă ale studenților sunt input-uri, care pot fi editate, după editare, datele noi sunt salvate prin apăsarea primului buton. Aceasta apelează **setDoc()**, pe un document deja existent.

După operațiile de adăugare, respectiv cele de ștergere tabelul trebuie resetat, ca urmare este apelată funcția **LoadTable**, care generează un tabel HTML pe baza datelor extrase din Firebase.

### API-uri folosite

Pentru a încărca adresa IP a utilizatorului am folosit **ipify API**, în timp ce pentru a scrie data curentă am folosit API-ul **Typescript Date()**.

## Îmbunătățirea aplicației

Aplicația este scrisă modular, fiind ușor de modificat și scalat în funcție de cerințe. Pe viitor pot fi adăugate funcții de prezență sau note pentru studenți, conturi pentru aceștia, având un panou separat de cel al profesorilor. Totodată, proiectul nu este responsive pentru dispozitivele mobile, o altă îmbunătățire fiind crearea de noi versiuni pentru ecranele mai mici.
