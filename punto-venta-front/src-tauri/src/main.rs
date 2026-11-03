#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod archivos;
mod backend;

use std::sync::Mutex;
use std::thread;

use backend::Backend;
use tauri::{AppHandle, Manager, RunEvent};
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

struct BackendActivo(Mutex<Option<Backend>>);

fn mostrar_sistema(app: &AppHandle) {
    if let Some(principal) = app.get_webview_window("main") {
        let _ = principal.show();
        let _ = principal.set_focus();
    }
    if let Some(carga) = app.get_webview_window("carga") {
        let _ = carga.close();
    }
}

fn arrancar(app: AppHandle) {
    match backend::iniciar(&app) {
        Ok(backend) => {
            *app.state::<BackendActivo>().0.lock().unwrap() = Some(backend);
            mostrar_sistema(&app);
        }
        Err(error) => {
            app.dialog()
                .message(error)
                .title("No se pudo iniciar Punto de Venta")
                .kind(MessageDialogKind::Error)
                .blocking_show();
            app.exit(1);
        }
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(BackendActivo(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![archivos::guardar_archivo])
        .setup(|app| {
            let handle = app.handle().clone();

            if cfg!(debug_assertions) {
                mostrar_sistema(&handle);
            } else {
                thread::spawn(move || arrancar(handle));
            }

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error al construir Tauri")
        .run(|app, evento| {
            if let RunEvent::Exit = evento {
                app.state::<BackendActivo>().0.lock().unwrap().take();
            }
        });
}
