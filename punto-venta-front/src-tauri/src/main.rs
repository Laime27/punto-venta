#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Child};
use std::sync::Mutex;
use tauri::Manager;

struct LaravelProcess(Mutex<Child>);

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let resource_dir = app.path().resource_dir().unwrap();

            let php_path = resource_dir.join("php").join("php.exe");
            let laravel_path = resource_dir.join("laravel-backend");

            let child = Command::new(&php_path)
                .arg(laravel_path.join("artisan"))
                .arg("serve")
                .arg("--host=127.0.0.1")
                .arg("--port=8765")
                .current_dir(&laravel_path)
                .spawn()
                .expect("No se pudo iniciar Laravel");

            app.manage(LaravelProcess(Mutex::new(child)));
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                if let Some(state) = window.app_handle().try_state::<LaravelProcess>() {
                    let _ = state.0.lock().unwrap().kill();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error al ejecutar Tauri");
}