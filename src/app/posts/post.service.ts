import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	constructor(private http: HttpClient, private router: Router) {}

	getPosts() {
		this.http
			.get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
			.pipe(
				map((postData) => {
					return postData.posts.map((post) => {
						return {
							id: post._id,
							title: post.title,
							content: post.content,
							imagePath: post.imagePath
						};
					});
				})
			)
			.subscribe((transformedPosts) => {
				this.posts = transformedPosts;
				this.postsUpdated.next([ ...this.posts ]);
			});
	}

	getPost(id: string) {
		return this.http.get<{ _id: string; title: string; content: string; imagePath: string }>(
			'http://localhost:3000/api/posts/' + id
		);
	}
	getPostUpdateListener() {
		return this.postsUpdated.asObservable();
	}

	addPost(title: string, content: string, image: File) {
		const postData = new FormData();
		postData.append('title', title);
		postData.append('content', content);
		postData.append('image', image, title);
		this.http
			.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData)
			.subscribe((res) => {
				const post = { id: res.post.id, title: title, content: content, imagePath: res.post.imagePath };
				this.posts.push(post);
				this.postsUpdated.next([ ...this.posts ]);
				this.router.navigate([ '/' ]);
			});
	}

	updatePost(id: string, title: string, content: string, image: File | string) {
		let post: FormData | Post;
		if (typeof image === 'object') {
			post = new FormData();
			post.append('title', title);
			post.append('content', content);
			post.append('image', image, title);
			post.append('id', id);
		} else {
			post = { id: id, title: title, content: content, imagePath: image };
		}
		this.http.put('http://localhost:3000/api/posts/' + id, post).subscribe((response) => {
			const updatedPosts = [ ...this.posts ];
			const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
			const iPost = { id: id, title: title, content: content, imagePath: '' };
			updatedPosts[oldPostIndex] = iPost;
			this.posts = updatedPosts;
			this.postsUpdated.next([ ...this.posts ]);
			this.router.navigate([ '/' ]);
		});
	}

	deletePost(postId: string) {
		this.http.delete('http://localhost:3000/api/posts/' + postId).subscribe(() => {
			const updatedPosts = this.posts.filter((post) => post.id !== postId);
			this.posts = updatedPosts;
			this.postsUpdated.next([ ...this.posts ]);
		});
	}
}
