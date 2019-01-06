import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private isAUthenticated = false;
	private token: string;
	private tokenTimer: any;
	private userId: string;
	private authStatusListener = new Subject<boolean>();
	constructor(private http: HttpClient, private router: Router) {}

	getToken() {
		return this.token;
	}

	getIsAuth() {
		return this.isAUthenticated;
	}

	getUserId() {
		return this.userId;
	}

	getAuthStatusListener() {
		return this.authStatusListener.asObservable();
	}

	createUser(email: string, password: string) {
		const authData: AuthData = { email: email, password: password };
		this.http.post(BACKEND_URL + 'signup', authData).subscribe(
			(response) => {
				this.router.navigate([ '/' ]);
			},
			(error) => {
				this.authStatusListener.next(false);
			}
		);
	}

	login(email: string, password: string) {
		const authData: AuthData = { email: email, password: password };
		this.http.post<{ token: string; expiresIn: number; userId: string }>(BACKEND_URL + 'login', authData).subscribe(
			(response) => {
				const token = response.token;
				this.token = token;
				if (token) {
					const expiresInDuration = response.expiresIn;
					this.setAuthTime(expiresInDuration);
					this.isAUthenticated = true;
					this.userId = response.userId;
					this.authStatusListener.next(true);
					const now = new Date();
					const expirationTime = new Date(now.getTime() + expiresInDuration * 1000);
					console.log(expirationTime);
					this.saveAuthData(token, expirationTime, this.userId);
					this.router.navigate([ '/' ]);
				}
			},
			(error) => {
				this.authStatusListener.next(false);
			}
		);
	}

	autoAuthUser() {
		const authInformation = this.getAuthData();
		if (!authInformation) {
			return;
		}
		const now = new Date();
		const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
		if (expiresIn > 0) {
			this.token = authInformation.token;
			this.isAUthenticated = true;
			this.userId = authInformation.userId;
			this.setAuthTime(expiresIn / 1000);
			this.authStatusListener.next(true);
		}
	}

	logout() {
		this.token = null;
		this.isAUthenticated = false;
		this.authStatusListener.next(false);
		clearTimeout(this.tokenTimer);
		this.clearAuthData();
		this.userId = null;
		this.router.navigate([ '/' ]);
	}

	private saveAuthData(token: string, expirationDate: Date, userId: string) {
		localStorage.setItem('token', token);
		localStorage.setItem('expiration', expirationDate.toISOString());
		localStorage.setItem('userId', userId);
	}

	private clearAuthData() {
		localStorage.removeItem('token');
		localStorage.removeItem('expiration');
		localStorage.removeItem('userId');
	}

	private getAuthData() {
		const token = localStorage.getItem('token');
		const expirationDate = localStorage.getItem('expiration');
		const userId = localStorage.getItem('userId');
		if (!token || !expirationDate) {
			return;
		}
		return {
			token: token,
			expirationDate: new Date(expirationDate),
			userId: userId
		};
	}

	private setAuthTime(duration: number) {
		console.log('Setting Timer = ' + duration);
		this.tokenTimer = setTimeout(() => {
			this.logout();
		}, duration * 1000);
	}
}
