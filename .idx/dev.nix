# .idx/dev.nix - Konfigurasi Mesin Maxim Driver App
{ pkgs, ... }: {
  # Menggunakan channel paket stabil
    channel = "stable-23.11";

      # Install paket yang dibutuhkan
        packages = [
            pkgs.nodejs_20  # Wajib untuk React/Vite
                pkgs.yarn
                    pkgs.git
                      ];

                        # Mengatur Environment Variables dasar (bukan secret)
                          env = {};

                            idx = {
                                # Ekstensi VS Code yang wajib ada (Langsung terinstall)
                                    extensions = [
                                          "ES7.React.js-snippets"
                                                "bradlc.vscode-tailwindcss"
                                                      "dbaeumer.vscode-eslint"
                                                            "usernamehw.errorlens" # Membantu melihat error kodingan
                                                                ];

                                                                    # Preview Configuration (Penting untuk PWA)
                                                                        previews = {
                                                                              enable = true;
                                                                                    previews = {
                                                                                            web = {
                                                                                                      # Menjalankan Vite secara otomatis
                                                                                                                command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
                                                                                                                          manager = "web";
                                                                                                                                  };
                                                                                                                                        };
                                                                                                                                            };

                                                                                                                                                # Workspace Lifecycle
                                                                                                                                                    workspace = {
                                                                                                                                                          # Perintah yang jalan otomatis saat workspace dibuat pertama kali
                                                                                                                                                                onCreate = {
                                                                                                                                                                        install-deps = "npm install";
                                                                                                                                                                              };
                                                                                                                                                                                    # Perintah yang jalan setiap kali workspace dibuka (restart)
                                                                                                                                                                                          onStart = {
                                                                                                                                                                                                  # Kadang perlu memastikan deps terupdate
                                                                                                                                                                                                          install-deps = "npm install"; 
                                                                                                                                                                                                                };
                                                                                                                                                                                                                    };
                                                                                                                                                                                                                      };
                                                                                                                                                                                                                      }