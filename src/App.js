import React, { Fragment, useRef, useEffect } from 'react';

import './App.scss';
import MainLayout from './components/MainLayout';
import SelectUserContextProvider from './context/SelectUserContext';
import OnlineUserContextProvider from './context/OnlineUserContext/OnlineUserContext';
import MessageContextProvider from './context/MessageContext/MessageContext';
import DatabaseMessageContextProvider from './context/DatabaseMessageContext/DatabaseMessageContext';
import WriteToDatabase from './components/WriteToDatabase';
import SettingsContextProvider from './context/SettingsContext';
import UploadMediaContextProvider from './context/MediaContext/UploadMediaContext';
import DownloadMediaContextProvider from './context/MediaContext/DownloadMediaContext';
import OldDownloadMediaContextProvider from './context/MediaContext/OldDownloadMediaContext';
import OldUploadMediaContextProvider from './context/MediaContext/OldUploadMediaContext';
import { SnackbarProvider } from 'notistack';

const App = () => {
	const notistackRef = useRef(false);

	return (
		<Fragment>
			<SnackbarProvider maxSnack={10} ref={notistackRef} autoHideDuration={2000} dense preventDuplicate>
				<SettingsContextProvider>
					<UploadMediaContextProvider>
						<DownloadMediaContextProvider>
							<OldDownloadMediaContextProvider>
								<OldUploadMediaContextProvider>
									<MessageContextProvider>
										<SelectUserContextProvider>
											<DatabaseMessageContextProvider>
												<OnlineUserContextProvider>
													<MainLayout></MainLayout>
													<WriteToDatabase></WriteToDatabase>
												</OnlineUserContextProvider>
											</DatabaseMessageContextProvider>
										</SelectUserContextProvider>
									</MessageContextProvider>
								</OldUploadMediaContextProvider>
							</OldDownloadMediaContextProvider>
						</DownloadMediaContextProvider>
					</UploadMediaContextProvider>
				</SettingsContextProvider>
			</SnackbarProvider>
		</Fragment>
	);
};

export default App;
