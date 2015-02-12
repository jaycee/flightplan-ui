This is a simple one-page web ui for a flight plan weather forecasting tool.

# Install

As this is a simple javascript application, you can simply drop the code in at
/var/www/html for a conventional apache2 setup.

It's recommended you remove the tests library, though leaving it is harmless
(though people can run the test suite by visiting the test url).

# Development

To run it locally, run `make run`. You can check the app on `localhost:8000`
To serve the tests, run `make test`. You can check the tests on
`localhost:3000/tests`.
