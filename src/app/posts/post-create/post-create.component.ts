import { NgForm } from '@angular/forms';
import { Component, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
	selector: 'app-post-create',
	templateUrl: './post-create.component.html',
	styleUrls: [ './post-create.component.css' ]
})
export class PostCreateComponent {
	enteredTitle = '';
	enteredContent = '';

	constructor(public postService: PostService) {}

	onCreatePost = (postForm: NgForm) => {
		if (postForm.invalid) {
			return;
		}
		this.postService.addPost(postForm.value.title, postForm.value.content);
		postForm.resetForm();
	};
}
