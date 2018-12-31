import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

	constructor(private http: HttpClient, private router: Router) {}

	getPosts(postsPerPage: number, currentPage: number) {
		const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
		this.http
			.get<{ message: string; posts: any; maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
			.pipe(
				map((postData) => {
					return {
						posts: postData.posts.map((post) => {
							return {
								id: post._id,
								title: post.title,
								content: post.content,
								imagePath: post.imagePath,
								creator: post.creator
							};
						}),
						maxPosts: postData.maxPosts
					};
				})
			)
			.subscribe((transformedPostData) => {
				console.log(transformedPostData);
				this.posts = transformedPostData.posts;
				this.postsUpdated.next({ posts: [ ...this.posts ], postCount: transformedPostData.maxPosts });
			});
	}

	getPost(id: string) {
		return this.http.get<{ _id: string; title: string; content: string; imagePath: string; creator: string }>(
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
			post = { id: id, title: title, content: content, imagePath: image, creator: null };
		}
		this.http.put('http://localhost:3000/api/posts/' + id, post).subscribe((response) => {
			this.router.navigate([ '/' ]);
		});
	}

	deletePost(postId: string) {
		return this.http.delete('http://localhost:3000/api/posts/' + postId);
	}
}
