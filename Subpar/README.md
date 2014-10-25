# SubPar

Andrew Cheng's [SubPar](https://github.com/achengs/subpar) ported to a LightTable plugin.
This provides a more feature complete paredit implementation than the official [Paredit](https://github.com/LightTable/Paredit).

## Usage

Install the plugin from LightTable's plugin manager. You'll need to bind keys to commands
defined in [subpar.cljs](https://github.com/Navgeet/subpar/tree/master/src/lt/plugins/subpar/subpar.cljs).
Here is [my keymap](https://github.com/Navgeet/LightTable-settings/blob/master/user.keymap).

## Features

* Delimiters
  * Backspace, Delete, Ctrl-D handle these: () {} [] "" \
  * Delimiters are created in pairs: () {} [] ""
  * Typing a closing delimiter moves past it after deleting any whitespace at the end of the current list
* Movement
  * Forward
  * Backward
  * Backward Up
  * Forward Down
  * Backward Down
  * Forward Up
* Barf / Slurp
  * Backward Barf
  * Forward Barf
  * Backward Slurp
  * Forward Slurp
* Splicing
  * Splice
  * Splice Delete Backward
  * Splice Delete Forward

This still lacks several features so bug reports and feature requests are highly appreciated.

## License

See [MIT License file](https://github.com/achengs/subpar/blob/master/LICENSE).
