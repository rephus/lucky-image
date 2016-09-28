## Description
Lucky image is an easy to use API to get images in a `I'm going to be lucky` way,
which means that the service redirects to the image without showing the list of
results; unless you specify format=json, which will return the `url` in a JSON object.

## Endpoints

### Image

Return a single image result from Duck Duck Go

#### Arguments

* q [Mandatory] : Search term
* format [Optional]: Use `format=json` to get a JSON back with an URL.

Give no format to get redirected to the image URL.

#### Sample

`/image?q=nyan+cat&format=json`

```
{
url: "http://4.bp.blogspot.com/-ODrDDRPwRYE/T5QbT4r3kzI/AAAAAAAAAng/1Ahxjbka4bw/s1600/nyan_cat.jpg"
}
```

### GIF

Return a GIF image by prepending "gif" to the search term and filtering only
`.gif` images

#### Arguments

* q [Mandatory] : Search term
* format [Optional]: Use `format=json` to get a JSON back with an URL.

#### Sample

`/gif?q=nyan-cat&format=json`

```
{
url: "http://www.likecool.com/Gear/Pic/Gif%20Nyan%20Cat/Gif-Nyan-Cat.gif"
}
```

## How to run

```
npm install
node lucky-image.js
```
