import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmptyValidator } from '../../validators/empty-validator';
import { RegisterForm } from '../../common/forms/register-form';
import { LoginServiceService } from 'src/app/services/login-service/login-service.service';
import { RegisterRequest } from 'src/app/common/request/register-request';
import { RegisterResponse } from 'src/app/common/response/register-response';
import { LoginRequest } from 'src/app/common/request/login-request';
import { LoginResponse } from 'src/app/common/request/login-response';
import { SessionStorageService } from '../../services/storage-service/session-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  loginFormGroup: FormGroup;
  registerFormGroup: FormGroup;
  hide = true;
  registerError=false;
  registerErrorMessage: string;

  constructor(private formBuilder: FormBuilder,
    private loginService:LoginServiceService,
    private storageService: SessionStorageService,
    private router: Router) {

    this.registerErrorMessage="";
    this.loginFormGroup = this.formBuilder.group({
      loginDetails: this.formBuilder.group({
        username:new FormControl('',[Validators.required,EmptyValidator.notOnlyWhiteSpace,Validators.minLength(2)]),
        password:new FormControl('',[Validators.required,EmptyValidator.notOnlyWhiteSpace,Validators.minLength(2)]
        )
      })
    });

    this.registerFormGroup = this.formBuilder.group({
      registerDetails: this.formBuilder.group({
        usernameRegister:new FormControl('',[Validators.required,EmptyValidator.notOnlyWhiteSpace,Validators.minLength(2)]),
        passwordRegister:new FormControl('',[Validators.required,EmptyValidator.notOnlyWhiteSpace,Validators.minLength(2)]),
        confirmPasswordRegister:new FormControl('',[Validators.required,EmptyValidator.notOnlyWhiteSpace,Validators.minLength(2)]),
        emailRegister:new FormControl('',[Validators.required,EmptyValidator.notOnlyWhiteSpace,
          Validators.minLength(2),Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      })
    });

  }

  get username(){return this.loginFormGroup.get('loginDetails.username');}
  get password(){return this.loginFormGroup.get('loginDetails.password');}

  get usernameRegister(){return this.registerFormGroup.get('registerDetails.usernameRegister');}
  get passwordRegister(){return this.registerFormGroup.get('registerDetails.passwordRegister');}
  get confirmPasswordRegister(){return this.registerFormGroup.get('registerDetails.confirmPasswordRegister');}
  get emailRegister(){return this.registerFormGroup.get('registerDetails.emailRegister');}

  ngOnInit(): void {
  }

  onSubmitLogin(){
    console.log("Handling the login submit button");

    if(this.loginFormGroup.invalid){
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    let loginRequest = new LoginRequest();
    loginRequest = this.loginFormGroup.controls['loginFormGroup'].value;

    this.loginService.loginUser(loginRequest).subscribe(response => {
      if(response.status === 200){
        let loginResponse = new LoginResponse();
        loginResponse = response.body;
        this.storageService.addDataToStorage("accessToken",loginResponse.token);
        this.storageService.addDataToStorage("refreshToken",loginResponse.refreshToken);
        this.storageService.addDataToStorage("user",loginResponse.username);
        this.storageService.addDataToStorage("authorities",loginResponse.grandedAuthorities);
        console.log(`loginSuccess`);
        this.loginService.pushAuthToken(true);
        this.router.navigateByUrl("/home");
      }else{

      }
    });
  }

  onSubmitRegister(){
    this.registerError=false;
    console.log("Handling the login submit button");

    if(this.registerFormGroup.invalid){
      this.registerFormGroup.markAllAsTouched();
      return;
    }

    let register = new RegisterForm();
    register = this.registerFormGroup.controls['registerDetails'].value;

    console.log(`pass1: ${register.passwordRegister} and pass2: ${register.confirmPasswordRegister}`);
    if(register.passwordRegister!==register.confirmPasswordRegister){
      console.log("passswords dont match");
      this.registerError=true;
      this.registerErrorMessage="Both Password's should pass";
      return;
    }

    let registerRequest = new RegisterRequest();
    let registerResponse = new RegisterResponse();
    registerRequest.email=register.emailRegister;
    registerRequest.username=register.usernameRegister;
    registerRequest.password=register.passwordRegister;
    registerRequest.authority="ROLE_USER";

    this.loginService.registerUser(registerRequest).subscribe(response =>{
      if(response.status===200){
        console.log("registration success");
        //TODO
      }else{
        this.registerError=true;
        registerResponse = response.body
        this.registerErrorMessage=registerResponse.message;
      }
    });

  }
}
