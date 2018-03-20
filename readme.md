# Simple questionnaire

A simple example of HTML+CSS3+Javascript+jQuery+Bootstrap

<p align="center">
  <img src="demo.gif" width="350"/>
</p>


JS Dependencies

| JS | Explanation | URL |         
| ----------------|:-------------|:-------------|
| Barrating | mini rating component | http://antenna.io/demo/jquery-bar-rating/examples/ |
| jQuery | JS library | http://jquery.com/ |
| Sweetalert | pretty alert for javascript | https://sweetalert.js.org |
| Gmaps.js | maps management | https://hpneo.github.io/gmaps/ |

For ajax requests to work correctly, mount it on a web server.

Using embed php webserver. ( can use any enabled port in your machine )

```bash php -S localhost:83```

This questionnaire are dynamic, you can insert all questions you want

```html
<div class="questionnaire" data-url="server-mock.php" data-lt="-12.043333" data-ln="-77.028333">
    ...
</div>    
```

| Attribute | Explanation |
| ----------------|:-------------|
| data-url | URL where the information will be sent once the questionnaire is finished |
| data-lt | Latitude |
| data-ln | Longitude |

@pd: There may be N instances of this same component that do not collide with each other.