# CommentCoreLibrary 弹幕核心通用构件
[![NPM version](https://badge.fury.io/js/comment-core-library.svg)](http://badge.fury.io/js/comment-core-library)
[![Bower version](https://badge.fury.io/bo/comment-core-library.svg)](http://badge.fury.io/bo/comment-core-library)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Build Status: Linux](https://travis-ci.org/jabbany/CommentCoreLibrary.svg?branch=master)](https://travis-ci.org/jabbany/CommentCoreLibrary)
[![Coverage Status](https://img.shields.io/coveralls/jabbany/CommentCoreLibrary.svg)](https://coveralls.io/r/jabbany/CommentCoreLibrary?branch=master)

Other Languages: [简体中文](README.zh_CN.md)

The CommentCoreLibrary is a set of Javascript modules that make up the
core controller for comments streaming on top of timed media (video or audio).
It is intended as a catalyst for the development of timed "danmaku" comments
in HTML5.

Developers willing to incorporate similar comment streaming functionalities
inside their own projects (whether web based or not) are encouraged to learn
from and extend from the CommentCoreLibrary.

## Testing
We have a live demo [here](http://jabbany.github.io/CommentCoreLibrary/demo).
Feel free to [open tickets](CONTRIBUTING.md) if this demo test has bugs.

## License
The CommentCoreLibrary is licensed under the permissive MIT License. If you wish
to use this in any project, you can simply include the following line:

    CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT license

## Installing
With [bower](http://bower.io/):
`bower install comment-core-library`

With [npm](https://www.npmjs.org/):
`npm install comment-core-library`

For Rails, installing with [rails-assets](https://rails-assets.org/) is recommended

In Gemfile:
```ruby
# Add https://rails-assets.org as the new gem source
source 'https://rails-assets.org'

gem 'rails-assets-comment-core-library'
```

## Examples and Documentation
- [Documentation](docs/) can be found inside the `docs/` folder.
- Experimental modules are in `experimental/`.
- You may test using test data found in `test/`.

## Contributing
We encourage any contributions to this project, please read
[CONTRIBUTING](CONTRIBUTING.md) for details on how to contribute to the project.

Also, feel free to have a look at our sister project
[ABPlayerHTML5](https://github.com/jabbany/ABPlayerHTML5) for a reference
implementation of a video player with CommentCoreLibrary.
