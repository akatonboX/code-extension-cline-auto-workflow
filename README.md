# cline-auto Documentation (README)

This extension is designed to automatically execute Cline workflows when VSCode starts.
Cline itself does not provide a way to run workflows automatically. This extension enables that functionality.
**Supported only on Windows.**

## Usage

### 1. Prepare a file as shown below. Replace `<workflow file name>` with the name of the workflow you want to execute.
```text
cline-auto-workflow=<workflow file name>
```
Please note the following:
- This must be written on the first line.
- You do not need to specify a directory for `<workflow file name>`. Just specify the file name of the `.md` file in `.clinerules\workflows\`.
- The file extension must be included in `<workflow file name>`.
- `<workflow file name>` must be 25 characters or less, including the extension.

### 2. Launch VSCode using the `code` command.
```shell
code -n <folder path> -- <file path>
```
- `-n`: An option for `code` to open a new window.
- `<folder path>`: Specify the folder path. Since `.clinerules` is required, be sure to specify it.
- `<file path>`: The path to the file you created earlier. This will open at startup. This extension will execute the text opened in the active editor with Cline at startup.

## Features

When VSCode starts, the `activate()` function of this extension is executed and performs the following:
1. Searches for the active editor. If not found, the process ends here. (Therefore, as described above, specify `<file path>` when launching.)
2. If the content of the active editor matches the usage described above, it creates a command from that content and sends it to Cline's chat using the `cline.addToChat` command.
3. Uses the included Windows command-line application ([EmulateEnter](./EmulateEnter/EmulateEnter/Program.cs)) to emulate the Enter key, causing Cline to execute the task.

## Requirements

- This may go against the design philosophy of Cline. Use at your own risk.
- This extension is for Windows only.
- Requires .Net Framework 4.7.2.

## Extension Settings

None.

## Known Issues

None.

## Release Notes

### 1.0.0

Initial release.
