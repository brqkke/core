<?php
$appDomain = getenv("BUTANUKI_APP_DOMAIN") ?: "localhost";
$recaptchaSiteKey = getenv("RECAPTCHA_SITE_KEY") ?: "6Lcb-_0hAAAAAC8-tO90VSvmff5x4_FNawvZgswr";

if(!function_exists("str_starts_with")){
    function str_starts_with ( $haystack, $needle ) {
        return strpos( $haystack , $needle ) === 0;
    }
}
$locale = $_GET["locale"] ?? "en";
if(isset($_POST['email'], $_POST["g-recaptcha-response"])){
    $ch = curl_init("https://$appDomain/api/auth/login/email");
    $data = json_encode([
        "email" => $_POST["email"],
        "captchaToken" => $_POST["g-recaptcha-response"],
        "locale" => $locale
    ]);
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $data );
    curl_setopt( $ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
    if(str_starts_with($appDomain, "localhost")){
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    }
    $result = curl_exec($ch);
    if($result !== false){
        $parsedResult = json_decode($result, true);
        if($parsedResult["success"] === true){
            header("Location: login.php?success");
            die();
        }
    }else{
        error_log(curl_error($ch));
    }
    header("Location: login.php?error");
    die();
} ?>
<?php include "header.php"; ?>
<?php if(isset($_GET["error"])): ?>
    <div class="alert alert-danger">An error occured. Please try again.</div>
<?php endif; ?>

<?php if(isset($_GET["success"])): ?>
    <div class="alert alert-success">Check emails</div>
<?php else: ?>
<a href="login.php?locale=en">English</a> | <a href="login.php?locale=fr">Français</a>
    <form action="login.php?locale=<?php echo urlencode($locale); ?>" id="login-form" method="post">
    <?php if($locale === "fr"): ?>
        <p>Entrez votre adresse email pour recevoir un lien de connexion</p>
    <?php else: ?>
        <p>Enter your email address to receive a login link</p>
    <?php endif; ?>
        <input class="form-control" name="email" placeholder="Email" />
        <input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response-input"/>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="checkTou" value="tou" onchange="oncheckChange()">
            <label class="form-check-label" for="checkTou">Accept the <a href="/conditions" target="_blank" rel="noreferrer">Terms Of Use</a></label>
        </div>
        <button id="login-button" disabled class="btn btn-primary">Login</button>
    </form>



<script src="https://www.google.com/recaptcha/api.js?render=<?php echo $recaptchaSiteKey; ?>"></script>
<script>
const loginBtn = document.getElementById("login-button");
const checkbox = document.getElementById("checkTou");
const form = document.getElementById("login-form");

form.addEventListener("submit", onsubmitform);

function onsubmitform(e) {
    e.preventDefault();
    if(!checkbox.checked){
        return;
    }
    grecaptcha.ready(function() {
      grecaptcha.execute('<?php echo $recaptchaSiteKey; ?>', {action: 'login'}).then(function(token) {
        document.getElementById("g-recaptcha-response-input").value = token;
        document.getElementById("login-form").submit()
      });
    });
}
function oncheckChange(){
    if(checkbox.checked){
        loginBtn.removeAttribute("disabled");
    }else{
        loginBtn.setAttribute("disabled", "disabled");
    }
}
</script>
<?php endif; ?>
<?php include "footer.php"; ?>
