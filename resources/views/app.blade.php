<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600&display=swap" rel="stylesheet" />

    <title>{{ config('app.name') }}</title>
</head>

<body>
    <div id="app"></div>
    @vite('resources/js/app.ts')
</body>

</html>