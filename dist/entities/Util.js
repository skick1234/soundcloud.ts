"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
var audioconcat = require("audioconcat");
var fs = require("fs");
var path = require("path");
var stream_1 = require("stream");
var undici_1 = require("undici");
var index_1 = require("./index");
var makeRequest = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, undici_1.request.apply(void 0, args).then(function (r) {
                        if (r.statusCode.toString().startsWith("2"))
                            return r.body;
                        throw new Error("Status code " + r.statusCode);
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
};
var Util = exports.Util = /** @class */ (function () {
    function Util(api) {
        var _this = this;
        this.api = api;
        this.playlists = new index_1.Playlists(this.api);
        this.users = new index_1.Users(this.api);
        this.tracks = new index_1.Tracks(this.api);
        /**
         * Gets the direct streaming link of a track.
         */
        this.streamLink = function (songUrl) { return __awaiter(_this, void 0, void 0, function () {
            var track, match, url, client_id, headers, connect, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.tracks.getV2(songUrl)];
                    case 1:
                        track = _c.sent();
                        match = (_b = track.media.transcodings.find(function (t) { return t.format.mime_type === "audio/mpeg" && t.format.protocol === "progressive"; })) === null || _b === void 0 ? void 0 : _b.url;
                        return [4 /*yield*/, this.api.getClientID()];
                    case 2:
                        client_id = _c.sent();
                        headers = this.api.headers;
                        if (!match) return [3 /*break*/, 9];
                        connect = match.includes("secret_token") ? "&client_id=".concat(client_id) : "?client_id=".concat(client_id);
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 8]);
                        return [4 /*yield*/, makeRequest(match + connect, { headers: headers })
                                .then(function (r) { return r.json(); })
                                .then(function (r) { return r.url; })];
                    case 4:
                        url = _c.sent();
                        return [3 /*break*/, 8];
                    case 5:
                        _a = _c.sent();
                        return [4 /*yield*/, this.api.getClientID(true)];
                    case 6:
                        client_id = _c.sent();
                        connect = match.includes("secret_token") ? "&client_id=".concat(client_id) : "?client_id=".concat(client_id);
                        return [4 /*yield*/, makeRequest(match + connect, { headers: headers })
                                .then(function (r) { return r.json(); })
                                .then(function (r) { return r.url; })];
                    case 7:
                        url = _c.sent();
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, null];
                    case 10: return [2 /*return*/, url];
                }
            });
        }); };
        /**
         * Readable stream of m3u playlists.
         */
        this.m3uReadableStream = function (songUrl) { return __awaiter(_this, void 0, void 0, function () {
            var headers, track, client_id, match, connect, m3uLink, m3u, urls, destDir, output, chunks, i, arrayBuffer, stream;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        headers = this.api.headers;
                        return [4 /*yield*/, this.tracks.getV2(songUrl)];
                    case 1:
                        track = _b.sent();
                        return [4 /*yield*/, this.api.getClientID()];
                    case 2:
                        client_id = _b.sent();
                        match = (_a = track.media.transcodings.find(function (t) { return t.format.mime_type === "audio/mpeg" && t.format.protocol === "hls"; })) === null || _a === void 0 ? void 0 : _a.url;
                        if (!match)
                            return [2 /*return*/, null];
                        connect = match.includes("secret_token") ? "&client_id=".concat(client_id) : "?client_id=".concat(client_id);
                        return [4 /*yield*/, makeRequest(match + connect, { headers: headers })
                                .then(function (r) { return r.json(); })
                                .then(function (r) { return r.url; })];
                    case 3:
                        m3uLink = _b.sent();
                        return [4 /*yield*/, makeRequest(m3uLink, { headers: headers }).then(function (r) { return r.text(); })];
                    case 4:
                        m3u = _b.sent();
                        urls = m3u.match(/(http).*?(?=\s)/gm);
                        destDir = path.join(__dirname, "temp");
                        if (!fs.existsSync(destDir))
                            fs.mkdirSync(destDir, { recursive: true });
                        output = "".concat(destDir, "/temp.mp3");
                        chunks = [];
                        i = 0;
                        _b.label = 5;
                    case 5:
                        if (!(i < urls.length)) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, undici_1.request)(urls[i], { headers: headers }).then(function (r) { return r.body.arrayBuffer(); })];
                    case 6:
                        arrayBuffer = _b.sent();
                        fs.writeFileSync("".concat(destDir, "/").concat(i, ".mp3"), Buffer.from(arrayBuffer));
                        chunks.push("".concat(destDir, "/").concat(i, ".mp3"));
                        _b.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 5];
                    case 8: return [4 /*yield*/, new Promise(function (resolve) {
                            audioconcat(chunks)
                                .concat(output)
                                .on("end", function () { return resolve(); });
                        })];
                    case 9:
                        _b.sent();
                        stream = stream_1.Readable.from(fs.readFileSync(output));
                        Util.removeDirectory(destDir);
                        return [2 /*return*/, stream];
                }
            });
        }); };
        /**
         * Downloads the mp3 stream of a track as readable stream.
         */
        this.downloadTrackReadableStream = function (songUrl) { return __awaiter(_this, void 0, void 0, function () {
            var url, readable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.streamLink(songUrl)];
                    case 1:
                        url = _a.sent();
                        if (!url)
                            return [2 /*return*/, this.m3uReadableStream(songUrl)];
                        return [4 /*yield*/, makeRequest(url, { headers: this.api.headers })];
                    case 2:
                        readable = _a.sent();
                        return [2 /*return*/, readable];
                }
            });
        }); };
        /**
         * Downloads the mp3 stream of a track.
         */
        this.downloadTrackStream = function (songUrl, title, dest) { return __awaiter(_this, void 0, void 0, function () {
            var finalMP3, stream, writeStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (title.endsWith(".mp3"))
                            title = title.replace(".mp3", "");
                        finalMP3 = path.extname(dest) ? dest : path.join(dest, "".concat(title, ".mp3"));
                        return [4 /*yield*/, this.downloadTrackReadableStream(songUrl)];
                    case 1:
                        stream = _a.sent();
                        writeStream = fs.createWriteStream(finalMP3);
                        stream.pipe(writeStream);
                        return [4 /*yield*/, new Promise(function (resolve) { return stream.on("end", function () { return resolve(); }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, finalMP3];
                }
            });
        }); };
        /**
         * Gets a track title from the page
         */
        this.getTitle = function (songUrl) { return __awaiter(_this, void 0, void 0, function () {
            var html, title;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, makeRequest(songUrl, { headers: this.api.headers }).then(function (r) { return r.text(); })];
                    case 1:
                        html = _c.sent();
                        title = (_b = (_a = html.match(/(?<="og:title" content=")(.*?)(?=")/)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.replace(/\//g, "");
                        return [2 /*return*/, title];
                }
            });
        }); };
        /**
         * Downloads a track on Soundcloud.
         */
        this.downloadTrack = function (trackResolvable, dest) { return __awaiter(_this, void 0, void 0, function () {
            var folder, track, client_id, result, _a, _b, _c, _d, _e, url, title;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!dest)
                            dest = "./";
                        folder = path.dirname(dest);
                        if (!fs.existsSync(folder))
                            fs.mkdirSync(folder, { recursive: true });
                        if (!trackResolvable.hasOwnProperty("downloadable")) return [3 /*break*/, 6];
                        track = trackResolvable;
                        if (!(track.downloadable === true)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.api.getClientID()];
                    case 1:
                        client_id = _f.sent();
                        return [4 /*yield*/, (0, undici_1.request)(track.download_url, { query: { client_id: client_id } })];
                    case 2:
                        result = _f.sent();
                        dest = path.extname(dest)
                            ? dest
                            : path.join(folder, "".concat(track.title.replace(/\//g, ""), ".").concat(result.headers["x-amz-meta-file-type"]));
                        _b = (_a = fs).writeFileSync;
                        _c = [dest];
                        _e = (_d = Buffer).from;
                        return [4 /*yield*/, result.body.arrayBuffer()];
                    case 3:
                        _b.apply(_a, _c.concat([_e.apply(_d, [_f.sent()])]));
                        return [2 /*return*/, dest];
                    case 4: return [2 /*return*/, this.downloadTrackStream(track.permalink_url, track.title.replace(/\//g, ""), dest)];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        url = trackResolvable;
                        return [4 /*yield*/, this.getTitle(url)];
                    case 7:
                        title = _f.sent();
                        return [2 /*return*/, this.downloadTrackStream(url, title, dest)];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Downloads an array of tracks.
         */
        this.downloadTracks = function (tracks, dest, limit) { return __awaiter(_this, void 0, void 0, function () {
            var resultArray, i, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!limit)
                            limit = tracks.length;
                        resultArray = [];
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < limit)) return [3 /*break*/, 6];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.downloadTrack(tracks[i], dest)];
                    case 3:
                        result = _b.sent();
                        resultArray.push(result);
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, resultArray];
                }
            });
        }); };
        /**
         * Downloads all the tracks from the search query.
         */
        this.downloadSearch = function (query, dest, limit) { return __awaiter(_this, void 0, void 0, function () {
            var tracks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tracks.searchV2({ q: query })];
                    case 1:
                        tracks = _a.sent();
                        return [2 /*return*/, this.downloadTracks(tracks.collection, dest, limit)];
                }
            });
        }); };
        /**
         * @deprecated
         * Downloads all of a users favorites.
         */
        this.downloadFavorites = function (userResolvable, dest, limit) { return __awaiter(_this, void 0, void 0, function () {
            var tracks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.users.favorites(userResolvable)];
                    case 1:
                        tracks = _a.sent();
                        return [2 /*return*/, this.downloadTracks(tracks, dest, limit)];
                }
            });
        }); };
        /**
         * Downloads all the tracks in a playlist.
         */
        this.downloadPlaylist = function (playlistResolvable, dest, limit) { return __awaiter(_this, void 0, void 0, function () {
            var playlist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.playlists.getAlt(playlistResolvable)];
                    case 1:
                        playlist = _a.sent();
                        return [2 /*return*/, this.downloadTracks(playlist.tracks, dest, limit)];
                }
            });
        }); };
        /**
         * Returns a readable stream to the track.
         */
        this.streamTrack = function (trackResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var track, client_id, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!trackResolvable.hasOwnProperty("downloadable")) return [3 /*break*/, 4];
                        track = trackResolvable;
                        if (!(track.downloadable === true)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.api.getClientID()];
                    case 1:
                        client_id = _a.sent();
                        return [2 /*return*/, makeRequest(track.download_url, { query: { client_id: client_id, oauth_token: this.api.oauthToken } })];
                    case 2: return [2 /*return*/, this.downloadTrackReadableStream(track.permalink_url)];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        url = trackResolvable;
                        return [2 /*return*/, this.downloadTrackReadableStream(url)];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Downloads a track's song cover.
         */
        this.downloadSongCover = function (trackResolvable, dest, noDL) { return __awaiter(_this, void 0, void 0, function () {
            var folder, track, artwork, title, client_id, url, arrayBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dest)
                            dest = "./";
                        folder = path.dirname(dest);
                        if (!fs.existsSync(folder))
                            fs.mkdirSync(folder, { recursive: true });
                        if (!trackResolvable.hasOwnProperty("artwork_url")) return [3 /*break*/, 1];
                        track = trackResolvable;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.tracks.getV2(trackResolvable)];
                    case 2:
                        track = _a.sent();
                        _a.label = 3;
                    case 3:
                        artwork = track.artwork_url ? track.artwork_url : track.user.avatar_url;
                        artwork = artwork.replace(".jpg", ".png").replace("-large", "-t500x500");
                        title = track.title.replace(/\//g, "");
                        dest = path.extname(dest) ? dest : path.join(folder, "".concat(title, ".png"));
                        return [4 /*yield*/, this.api.getClientID()];
                    case 4:
                        client_id = _a.sent();
                        url = "".concat(artwork, "?client_id=").concat(client_id);
                        if (noDL)
                            return [2 /*return*/, url];
                        return [4 /*yield*/, makeRequest(url).then(function (r) { return r.arrayBuffer(); })];
                    case 5:
                        arrayBuffer = _a.sent();
                        fs.writeFileSync(dest, Buffer.from(arrayBuffer));
                        return [2 /*return*/, dest];
                }
            });
        }); };
    }
    Util.removeDirectory = function (dir) {
        if (!fs.existsSync(dir))
            return;
        fs.readdirSync(dir).forEach(function (file) {
            var current = path.join(dir, file);
            if (fs.lstatSync(current).isDirectory()) {
                Util.removeDirectory(current);
            }
            else {
                fs.unlinkSync(current);
            }
        });
        try {
            fs.rmdirSync(dir);
        }
        catch (error) {
            console.log(error);
        }
    };
    return Util;
}());
