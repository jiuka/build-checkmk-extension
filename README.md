# build-checkmk-extension

<p align="left">
  <a href="https://github.com/jiuka/build-checkmk-extension/actions">
    <img alt="build-checkmk-extension status" src="https://github.com/jiuka/build-checkmk-extension/workflows/units-test/badge.svg">
    <img alt="build-checkmk-extension status" src="https://github.com/jiuka/build-checkmk-extension/workflows/npm%20audit/badge.svg">
  </a>
</p>

This action builds a [Checkmk](https://checkmk.de) extension package from a source directory.

# Usage

See [action.yml](action.yml)

## Basic
```yaml
steps:
- uses: actions/checkout@v1
- uses: jiuka/build-checkmk-extension@v1
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!
