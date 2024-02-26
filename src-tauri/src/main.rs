// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::OpenOptions;
use std::fs::read_to_string;
use std::io::Write;

#[tauri::command]
fn clear_file(path: String) -> Result<(), String> {
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(&path)
        .map_err(|e| e.to_string())?;
    file.set_len(0).map_err(|e| e.to_string())?;
    file.flush().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn append_chunk_to_file(path: String, chunk: Vec<u8>) -> Result<(), String> {
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&path)
        .map_err(|e| e.to_string())?;
    file.write_all(&chunk).map_err(|e| e.to_string())?;
    file.flush().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn read_file(path: String) -> String {
    read_to_string(path).unwrap()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![append_chunk_to_file, clear_file, read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
