import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { mimeType } from './mime-type.validator';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
	selector: 'app-post-create',
	templateUrl: './post-create.component.html',
	styleUrls: [ './post-create.component.css' ]
})
export class PostCreateComponent implements OnInit {
	enteredTitle = '';
	enteredContent = '';
	postForm: FormGroup;
	imagePreview: string | ArrayBuffer;
	private mode = 'create';
	private postId: string;
	post: Post;
	isLoading = false;

	constructor(public postService: PostService, public route: ActivatedRoute) {}

	ngOnInit() {
		this.postForm = new FormGroup({
			title: new FormControl(null, { validators: [ Validators.required, Validators.minLength(3) ] }),
			content: new FormControl(null, { validators: [ Validators.required ] }),
			image: new FormControl(null, { validators: [ Validators.required ], asyncValidators: [ mimeType ] })
		});
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('postId')) {
				this.mode = 'edit';
				this.postId = paramMap.get('postId');
				this.isLoading = true;
				this.postService.getPost(this.postId).subscribe((post) => {
					this.isLoading = false;
					this.post = {
						id: post._id,
						title: post.title,
						content: post.content,
						imagePath: post.imagePath,
						creator: post.creator
					};
					this.postForm.setValue({
						title: this.post.title,
						content: this.post.content,
						image: this.post.imagePath
					});
				});
			} else {
				this.mode = 'create';
				this.postId = null;
			}
		});
	}

	onSavePost = () => {
		if (this.postForm.invalid) {
			return;
		}
		this.isLoading = true;
		if (this.mode === 'create') {
			this.postService.addPost(this.postForm.value.title, this.postForm.value.content, this.postForm.value.image);
		} else {
			this.postService.updatePost(
				this.postId,
				this.postForm.value.title,
				this.postForm.value.content,
				this.postForm.value.image
			);
		}
		this.postForm.reset();
	};

	onImageChange = (event: Event) => {
		const file = (event.target as HTMLInputElement).files[0];
		this.postForm.patchValue({ image: file });
		this.postForm.get('image').updateValueAndValidity();
		const reader = new FileReader();
		reader.onload = () => {
			this.imagePreview = reader.result;
		};
		reader.readAsDataURL(file);
	};
}
