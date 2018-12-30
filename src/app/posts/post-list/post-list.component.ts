import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

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

	constructor(public postService: PostService) {}

	ngOnInit() {
		this.postService.getPosts();
		this.isLoading = true;
		this.postSub = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
			this.isLoading = false;
			this.posts = posts;
		});
	}

	onDelete(postId: string) {
		this.postService.deletePost(postId);
	}

	ngOnDestroy() {
		this.postSub.unsubscribe();
	}
}
