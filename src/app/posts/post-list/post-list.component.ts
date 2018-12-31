import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
	selector: 'app-post-list',
	templateUrl: './post-list.component.html',
	styleUrls: [ './post-list.component.css' ]
})
export class PostListComponent implements OnInit, OnDestroy {
	// posts = [
	// 	{ title: 'First Post', content: 'First Post Content' },
	// 	{ title: 'Second Post', content: 'Second Post Content' },
	// 	{ title: 'Third Post', content: 'Third Post Content' }
	// ];
	posts: Post[] = [];
	private postSub: Subscription;
	isLoading = false;
	totalPosts = 0;
	postsPerPage = 2;
	currentPage = 1;
	userId: string;
	pageSizeOptions = [ 1, 2, 5, 10 ];
	private authStatusSub: Subscription;
	isUserAuthenticated = false;
	constructor(public postService: PostService, private authService: AuthService) {}

	ngOnInit() {
		this.postService.getPosts(this.postsPerPage, this.currentPage);
		this.isLoading = true;
		this.userId = this.authService.getUserId();
		this.postSub = this.postService
			.getPostUpdateListener()
			.subscribe((postData: { posts: Post[]; postCount: number }) => {
				this.isLoading = false;
				this.totalPosts = postData.postCount;
				this.posts = postData.posts;
			});
		this.isUserAuthenticated = this.authService.getIsAuth();
		this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
			this.isUserAuthenticated = isAuthenticated;
			this.userId = this.authService.getUserId();
		});
	}

	onChangedPage(pageData: PageEvent) {
		this.isLoading = true;
		this.currentPage = pageData.pageIndex + 1;
		this.postsPerPage = pageData.pageSize;
		this.postService.getPosts(this.postsPerPage, this.currentPage);
	}

	onDelete(postId: string) {
		this.isLoading = true;
		this.postService.deletePost(postId).subscribe(
			() => {
				this.postService.getPosts(this.postsPerPage, this.currentPage);
			},
			() => {
				this.isLoading = false;
			}
		);
	}

	ngOnDestroy() {
		this.postSub.unsubscribe();
		this.authStatusSub.unsubscribe();
	}
}
