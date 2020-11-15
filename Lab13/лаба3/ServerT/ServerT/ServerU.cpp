#include "pch.h"
#include <iostream>
#include <string>
#include "Winsock2.h"

#pragma comment(lib, "WS2_32.lib")

std::string  GetErrorMsgText(int code)
{
	switch (code)
	{
	case WSAEINTR:			return "Работа функции прервана ";
	case WSAEACCES:			return "Разрешение отвергнуто";
	case WSAEFAULT:			return "Ошибочный адрес";
	case WSAEINVAL:			return "Ошибка в аргументе";
	case WSAEMFILE:			return "Слишком много файлов открыто";
	case WSAEWOULDBLOCK:	return "Ресурс временно недоступен";
	case WSAEINPROGRESS:	return "Операция в процессе развития";
	case WSAEALREADY:		return "Операция уже выполняется";
	case WSAENOTSOCK:		return "Сокет задан неправильно";
	case WSAEDESTADDRREQ:	return "Требуется адрес расположения";
	case WSAEMSGSIZE:		return "Сообщение слишком длинное";
	case WSAEPROTOTYPE:		return "Неправильный тип протокола для сокета";
	case WSAENOPROTOOPT:	return "Ошибка в опции протокола";
	case WSAEPROTONOSUPPORT: return "Протокол не поддерживается";
	case WSAESOCKTNOSUPPORT: return "Тип сокета не поддерживается";
	case WSAEOPNOTSUPP:		return "Операция не поддерживается";
	case WSAEPFNOSUPPORT:	return "Тип протоколов не поддерживается";
	case WSAEAFNOSUPPORT:	return "Тип адресов не поддерживается протоколом";
	case WSAEADDRINUSE:		return "Адрес уже используется";
	case WSAEADDRNOTAVAIL:	return "Запрошенный адрес не может быть использован";
	case WSAENETDOWN:		return "Сеть отключена";
	case WSAENETUNREACH:	return "Сеть не достижима";
	case WSAENETRESET:		return "Сеть разорвала соединение";
	case WSAECONNABORTED:	return "Программный отказ связи";
	case WSAECONNRESET:		return "Связь восстановлена";
	case WSAENOBUFS:		return "Не хватает памяти для буферов";
	case WSAEISCONN:		return "Сокет уже подключен";
	case WSAENOTCONN:		return "Сокет не подключен";
	case WSAESHUTDOWN:		return "Нельзя выполнить send : сокет завершил работу";
	case WSAETIMEDOUT:		return "Закончился отведенный интервал  времени";
	case WSAECONNREFUSED:	return "Соединение отклонено";
	case WSAEHOSTDOWN:		return "Хост в неработоспособном состоянии";
	case WSAEHOSTUNREACH:	return "Нет маршрута для хоста";
	case WSAEPROCLIM:		return "Слишком много процессов";
	case WSASYSNOTREADY:	return "Сеть не доступна";
	case WSAVERNOTSUPPORTED: return "Данная версия недоступна";
	case WSANOTINITIALISED:	return "Не выполнена инициализация WS2_32.DLL";
	case WSAEDISCON:		return "Выполняется отключение";
	case WSATYPE_NOT_FOUND: return "Класс не найден";
	case WSAHOST_NOT_FOUND:	return "Хост не найден";
	case WSATRY_AGAIN:		return "Неавторизированный хост не найден";
	case WSANO_RECOVERY:	return "Неопределенная  ошибка";
	case WSANO_DATA:		return "Нет записи запрошенного типа";
	case WSA_INVALID_HANDLE: return "Указанный дескриптор события  с ошибкой";
	case WSA_INVALID_PARAMETER: return "Один или более параметров с ошибкой";
	case WSA_IO_INCOMPLETE:	return "Объект ввода - вывода не в сигнальном состоянии";
	case WSA_IO_PENDING:	return "Операция завершится позже";
	case WSA_NOT_ENOUGH_MEMORY: return "Не достаточно памяти";
	case WSA_OPERATION_ABORTED: return "Операция отвергнута";
	case WSASYSCALLFAILURE: return "Аварийное завершение системного вызова";
	default:				return "**ERROR**";
	};
};

std::string  SetErrorMsgText(std::string msgText, int code)
{
	return  msgText + GetErrorMsgText(code);
};

int main()
{
	setlocale(LC_CTYPE, "rus");

	WSADATA wsaData;
	SOCKET sS;

	try
	{
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
		{
			throw  SetErrorMsgText("Startup:", WSAGetLastError());
		}
		if ((sS = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET)
		{
			throw  SetErrorMsgText("socket:", WSAGetLastError());
		}

		SOCKADDR_IN serv;
		serv.sin_family = AF_INET;
		serv.sin_port = htons(2000);
		serv.sin_addr.s_addr = INADDR_ANY;

		if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("bind:", WSAGetLastError());
		}

		SOCKADDR_IN from;
		memset(&from, 0, sizeof(from));
		int lfrom = sizeof(from);

		while (true)
		{
			std::cout << "Сервер готов принимать сообщения!";
			char buf[50];

			while (true)
			{
				if ((recvfrom(sS, buf, sizeof(buf), 0, (LPSOCKADDR)&from, &lfrom)) == SOCKET_ERROR)
					throw  SetErrorMsgText("recvfrom:", WSAGetLastError());

				Sleep(5000);
				std::cout << std::endl << "Принятое сообщение: " << buf;

				if ((sendto(sS, buf, sizeof(buf), 0, (LPSOCKADDR)&from, sizeof(from))) == SOCKET_ERROR)
					throw  SetErrorMsgText("sendto:", WSAGetLastError());

			}
		}

		if (closesocket(sS) == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("closesocket:", WSAGetLastError());
		}
		if (WSACleanup() == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("Cleanup:", WSAGetLastError());
		}
	}
	catch (std::string errorMsgText)
	{
		std::cout << std::endl << errorMsgText;
	}

	std::cout << std::endl;
	system("pause");
	return 0;
}
