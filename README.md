# build-checkmk-extension

<p align="left">
  <a href="https://github.com/jiuka/build-checkmk-extension/actions">
    <img alt="build-checkmk-extension status" src="https://github.com/jiuka/build-checkmk-extension/workflows/units-test/badge.svg">
    <img alt="build-checkmk-extension status" src="https://github.com/jiuka/build-checkmk-extension/workflows/npm%20audit/badge.svg">
  </a>
</p>

This action builds a [Checkmk](https://checkmk.de) extension package from a source directory.

# Usage

Version 2 introduces support for the new agent_based Plugins introduced in Checkmk Version 2. For extensions for Checkmk Version 1.6 and below please use Version 1 of the action.

See [action.yml](action.yml)

## Basic

### Build Extension for Checkmk 2

```yaml
steps:
- uses: actions/checkout@v1
- uses: jiuka/build-checkmk-extension@v2
```

### Build Extension for Checkmk 1

```yaml
steps:
- uses: actions/checkout@v1
- uses: jiuka/build-checkmk-extension@v1
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!
