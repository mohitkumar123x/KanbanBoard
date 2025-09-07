
#include <crow_all.h>
#include "task.h"
#include "prioritizer.h"
// #include <spdlog/spdlog.h>
// #include <spdlog/sinks/basic_file_sink.h>

int main() {
    // Set up logging
    auto logger = spdlog::basic_logger_mt("microservice", "logs/cpp-microservice.log");
    spdlog::set_default_logger(logger);

    crow::SimpleApp app;

    CROW_ROUTE(app, "/prioritize").methods("POST"_method)([](const crow::request& req) {
        auto json = crow::json::load(req.body);
        if (!json) {
            return crow::response(400, "Invalid JSON");
        }

        std::string title = json["title"].s();
        std::string description = json["description"].s();
        Task task(title, description);
        int priority = Prioritizer::calculatePriority(task);

        crow::json::wvalue result;
        result["priority"] = priority;
        return crow::response(result);
    });

    app.port(8080).multithreaded().run();
}
