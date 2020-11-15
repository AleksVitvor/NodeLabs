#include "pch.h"
#include <iostream>
#include <string>
#include <time.h>
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
		if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
		{
			throw  SetErrorMsgText("socket:", WSAGetLastError());
		}

		SOCKADDR_IN serv;
		serv.sin_family = AF_INET;
		serv.sin_port = htons(40000);
		serv.sin_addr.s_addr = INADDR_ANY;

		if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("bind:", WSAGetLastError());
		}
		if (listen(sS, SOMAXCONN) == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("listen:", WSAGetLastError());
		}

		SOCKET cS;
		SOCKADDR_IN clnt;
		memset(&clnt, 0, sizeof(clnt));
		int lclnt = sizeof(clnt);

		while (true)
		{
			std::cout << std::endl << "Ожидание подключения...";

			if ((cS = accept(sS, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET)
			{
				throw  SetErrorMsgText("accept:", WSAGetLastError());
			}

			std::cout << std::endl << "Клиент подключился!";
			std::cout << std::endl << "IP-адрес: " << inet_ntoa(clnt.sin_addr);
			std::cout << std::endl << "Port: " << htons(clnt.sin_port);

			try
			{
				int sizeLastMessage = 1;
				char message[] = "Hello from Client";

				while (sizeLastMessage != 0)
				{
					if ((sizeLastMessage = recv(cS, message, sizeof(message), NULL)) == SOCKET_ERROR) 
					{
						throw  SetErrorMsgText("recv:", WSAGetLastError());
					}

					if (sizeLastMessage == 0)
						break;
									
					char newMessage[25] = "";
					strcat_s(newMessage, "ECHO: ");
					strcat_s(newMessage, message);

					if ((send(cS, newMessage, strlen(newMessage) + 1, NULL)) == SOCKET_ERROR)
					{
						throw  SetErrorMsgText("send:", WSAGetLastError());
					}

					std::cout << std::endl << "Принятое сообщение: " << message;

				}

			}
			catch (std::string errorMsgText)
			{
				std::cout << std::endl << "Связь с клиентом разорвана!";
			}
		}

		if (closesocket(cS) == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("closesocket:", WSAGetLastError());
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
